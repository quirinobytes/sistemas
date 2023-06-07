#!/usr/bin/env node

const debug = false
//require("./console-file");
//console.file("/console.log");

//mongo config
var db = require('./config/db_config.js')
var chatMessageModel = require('./models/chatMessageModel')
var chatMessageController = require('./controllers/chatMessageController')
var privateMessageModel = require('./models/privateMessageModel')
var privateMessageController = require('./controllers/privateMessageController')
var eviteModel = require('./models/eviteModel')
var evite = require('./controllers/evitesController')

//prometheus / socket.io
const prometheus = require ('socket.io-prometheus-metrics')

//prometheus metrics
const apiMetrics = require('prometheus-api-metrics')
// const HttpMetricsCollector = require('prometheus-api-metrics').HttpMetricsCollector;
// const collector = new HttpMetricsCollector()

//const promBundle = require("express-prom-bundle")
const Prometheus = require('prom-client')
const messagesTotal = new Prometheus.Counter({
	name: 'messages_total',
	help: 'Total number of user\'s Mural messages',
	labelNames: ['add_user_message']
})

// servir o favicon.ico
const favicon = require('serve-favicon')

// usado retorno do content-type para envio de anexos permitidos.
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js:  'application/javascript'
}

//opcoes para o convert ANSI COLOR to HTML criar nova linha tmb
var Convert = require('ansi-to-html')
var convert = new Convert({
    fg: '#FFF',
    bg: '#000',
    newline: true,
    escapeXML: false,
    stream: false
})

//import do uuid: Identificador unico para Medias(Fotos/Videos)
const { v4: uuidv4 } = require('uuid')
var path = require('path')
var fs = require('fs')
var commands_json = 'config/comandos.json'
var commandsJsonFile = fs.readFileSync(commands_json)
var commands = JSON.parse(commandsJsonFile)
//var commands = [{ command: "ping 8.8.8.8 -c1"},{command: "/root/shell/push/deploy.js deploy"},{command:"/root/shell/push/command.js 'wall rafael'"},{command:"hostname"}];

// Formidable para upload de arquivos
var formidable = require('formidable')

// Layout do ejs
var expressLayouts = require('express-ejs-layouts')

// Usando Middleware Express
const express = require('express')
const id = require('faker/lib/locales/id_ID')
const app = express()

// Add the options to the prometheus middleware most option are for http_request_duration_seconds histogram metric
// const metricsMiddleware = promBundle({
//     includeMethod: true, 
//     includePath: true, 
//     includeStatusCode: true, 
//     includeUp: true,
//     customLabels: {
// 		project_name: 'servidorpush',
// 		project_type: 'cdshelld_server'
// 	},
//     promClient: {
//         collectDefaultMetrics: {
//         }
//       }
// })



var history="";
var nodes=[];

var chatMessageId = 0;
var projetos = [{id:01,"name":"shell","apelido":"CDSHELL","desc":"Esse projeto é sobre o CDSHELL","farms":"cdshell_FARM","equipe":"BackEnd-Nodejs"},{id:02,"name":"workspace","apelido":"My Workspace","desc":"Esse projeto contém todo meu Wrokspace Atual","farms":"workspace_FARM","equipe":"BackEnd-Nodejs,FrontEnd-Angular,ArtificalInteligence"}];
var farms = [{id:01,"name":"cdshell_FARM","apelido":"CDSHELL FARM","desc":"Esse projeto é sobre o CDSHELL","nodes":["dev1","dev2"]},{id:02,"name":"workspace_FARM","apelido":"WK FARM","desc":"Esse projeto é sobre o WORKSPACE","nodes":["dev3","dev4"]}];
var roles = [{id:01,"name":"frontend","apelido":"Servidores Front-End","icon":"https://visualpharm.com/assets/896/Cisco%20Router-595b40b75ba036ed117d8b7b.svg"},{id:02,"name":"backend","apelido":"Servidores Back-End","icon":"https://visualpharm.com/assets/419/Hub-595b40b75ba036ed117d8d05.svg"},{id:03,"name":"Nas","apelido":"Servidores NAS","icon":"https://visualpharm.com/assets/761/Nas-595b40b75ba036ed117d8dcd.svg"}];
var logged_users = [];
var lastMessageFrom = []
var destino = {}
var destino2 = {}


// function that check for basic auth header and return the username base64 decoded.
function getUsernameFromHeadersAuthorization(req){
	// verify auth credentials <- Aqui eu pego as credenciais para uso no kong
	//username = '';
	if (!req.headers.authorization)  return null
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    let [user, password] = credentials.split(':')
	//console.log(" # _log: getUsernameFromHeadersAuthorization()\n username:"+user+ "\n #")
	return user;
}

function chat_add_message({username,message,identificador,filepath}){
	time = new Date()
	chatMessageId++;

	if (username!==undefined) {
		//incrementando o contador do metrics do prometheus
		messagesTotal.inc({add_user_message: username})
	}
	else{
		console.log("☢ [WARNING] Necessário refazer o login do usuário")
		
		
		return false
		//o certo aqui era fazer erro 400, ou um reautenticate
	}
	
	// Salvando na database
	chatMessageController.save({id:chatMessageId,username:username,message,time,identificador,filepath}, function(data){
		if (data.error) {
			console.log({error:" ❌ [ERROR] Erro ao salvar mensagem id["+chatMessageId+"] na database do Mural"})
			return false
		}
		else {
			return true
		}
	})
	
}

function findValueByPrefix(object, prefix) {
	for (var property in object) {
		if (object.hasOwnProperty(property) && 
			property.toString().startsWith(prefix)) {
			return object[property];
		}
	}
}

function addMessageContactToPerson({from:from,to:to,message:message,time:time, identificador:identificador}){
	//se nao tiver carregado um board para falar com alguem, aqui pode ficar sem um para
	if (!to && !from && !message ){
		console.log("❌ [ERROR] Veio faltando dados na mensagem privada! \nOu o to: | ou o from: | ou o message:")
		console.log(to+" | "+from+" | "+message + " | " + time)
	 	return
	}
	if (!time)
		dateTime = new Date(time)
	else
		dateTime = time

	var id = uuidv4()
	prefix = from + "_" + to
	prefixinv = to + "_" + from
	idto = to+id

	privateMessageController.save(idto,prefixinv,from,to,message,dateTime,identificador, function(resposta){
		if (resposta.error)	{
			console.log("❌ [ERROR] Deu algum erro ao passar pela privateMessageController.save('idto,prefixinv,from,to,message,dateTime,identificador')\nResposta: ")
			console.log(resposta)
			console.log("\n\n idto,prefixinv,from,to,message,dateTime,identificador = ") 
			console.log(idto,prefixinv,from,to,message,dateTime,identificador)
			return false
		}
		else return true
	})

	idfrom = from+id
	privateMessageController.save(idfrom,prefix,from,to,message,dateTime,identificador, function(resposta){
		if (resposta.error) {
			console.log("❌ [ERROR]: falha ao salvar privateMessage")
			console.log("❌ [ERROR]: resposta.error = "+resposta.error) 
			console.log(resposta)
		}
	})
}

//############################################################
// Open HTTP Listen on port 3000
server = app.listen(3000)

//socket.io instantiation usando HTTP express server
const io = require("socket.io")(server)

//set the template engine ejs
app.set('view engine', 'ejs')
//usando o layout do EJS
app.use(expressLayouts)

//middlewares
app.use(express.static('public'))
app.use(express.static('public/js'))
app.use(express.static('public/jquery'))
app.use(express.static('public/lib/js/peerjs'))
app.use(express.static('lib/js'))
app.use(express.static('lib'))
app.use(favicon(__dirname + '/public/imagem_comum/favicon.ico'))

// create /metrics and add the prometheus middleware to all routes
//app.use(metricsMiddleware)

//collect HTTP Api metrics/duration
//app.use(apiMetrics())
app.use(apiMetrics({
	additionalLabels: ['user', 'ip'],
	extractAdditionalLabelValuesFn: (req, res) => {
		const headers = req.headers.authorization;
		
//		console.log("#METRICS " +req.host +" | " + req.headers.authorization)
//		console.log(req)
//		console.log(authorization)
		if (req.headers){
			let username = getUsernameFromHeadersAuthorization(req)
			return {user: username,	ip: req['hostname']	}
		}
		else
			return {
				user: 'root',
				ip: req['hostname']
		    }
	}
  }))

// //############################################################
// // OPEN TELEMETRY

//   function getRandomNumber(min, max) {
// 	return Math.floor(Math.random() * (max - min) + min);
//   }
  
//   app.get("/rolldice", (req, res) => {
// 	res.send(getRandomNumber(1, 6).toString());
//   });
  


//___________________________________________
//
//   ###########
//   RESTful API
//   ###########
//___________________________________________

app.get('/mural', (req, res) => {
	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') {nome = "anonymous"}
	res.render('mural',{usuario:nome })
})

app.get('/style.css', (req,res) => {
	res.contentType(type="text/css")
	fs.readFile('public/my/css/style.css', function(err, style) {
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.end(style);
	});
})

app.get('/ultimosItensChatMessage/:apos', (req, res) => {
	var aposX = req.params.apos;
    // console.log("quero chatMessages APOS ["+aposX+"] itens agora")

	chatMessageController.ultimosItens(parseInt(aposX),function(resp){
		// console.log("[INFO] Retorno dos ultimosItens resp=")
		// console.log("resp = ") 
		// console.log(resp)
		//	res.json(resp)
		var array = []
		if (resp.resposta) 
			console.log("❌ [ERROR] Deu ruim na obtencao de chatmessages no mural")
		else
			if (resp)
				resp.forEach(function(item){
					array.push(item._doc)
				})
			res.json(array)
			res.end()
	})
})


app.get('/getVotosPorIdentificador/:identificador', (req, res) => {
	var identificador = req.params.identificador;
	chatMessageController.getVotosPorIdentificador(identificador,function(resp){
		// console.log(resp)
		res.json(resp)
		res.end()
	})
})

app.get ('/privado',function (req,res) {
	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') {nome = "anonymous"}
	//console.log("user:"+nome)

	res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Credentials', true);

	res.render('privado',{usuario:nome })
})

app.get ('/logged_users',function (req,res) {
	//console.log(logged_users)
	res.json(logged_users)
})

app.get ('/rest/loadChatWith/:from/:to/:apos',function (req,res) {
	const from = req.params.from;
	const to = req.params.to;
	const aposNItens = req.params.apos;
	const toAndFrom = to+"_"+from

	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') {nome = "anonymous"}

	//console.log("GET no /rest/loadChatWith/"+from+"/"+to)
	privateMessageController.ultimos10(toAndFrom, aposNItens, function(resp){
		var array = []
		if (resp)
			resp.forEach(function(item){
				array.push(item._doc)
				//console.log(item._doc)
			})
		res.json(array)
		res.end()
	})

	// prefix = from + "_" + to;
	// obj = findValueByPrefix(privadoChat,prefix)
	// // console.log(obj)
	// res.send(obj)
})

app.get('/upload', (req, res) => {
	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') nome = "anonymous"

	path = "./fileupload/";
	//abre o diretorio path e renderiza para o ejs renderizar o arquivo upload.ejc com a var items
	fs.readdir(path, (err, files) => res.render('upload', { usuario:nome, items: files }  ))
})

app.post('/fileupload', (req, res) => {
	var form = new formidable.IncomingForm()

	form.parse(req, function (err, fields, files) {
		var oldpath = files.filetoupload.path;
		var newpath = './fileupload/' + files.filetoupload.name;
		
		fs.copyFile(oldpath, newpath, function (err) {
			if (err) throw err;
			//prometheus metrics
			//collector.collect(err || res)
			//res.write('File uploaded and moved!')
			res.redirect('./upload')
			res.end()
		})
	})
})

// recebe o post de enviar arquivos de FOTOS E VIDEOS, salva e grava a TAG HTML correta.
app.post('/fileuploadMural/',  (req, res) => {
	var path = require('path')
	var options = { maxFileSize: '250mb' }
	var form = new formidable.IncomingForm(options)

	form.parse(req, function (err, fields, files) {
		if (err) throw err;

		if (!files.filetoupload.name) return
		
		filename = files.filetoupload.name
		var fileExtension = path.extname(filename)
		// console.log("FILE TYPE: "+fileExtension)

		var username = fields.usuario
		// var time = fields.time
		var time = new Date()
		var messageInAttach = fields.messageInAttach
		
		var identificarUnico = uuidv4()
		identificarUnico = identificarUnico.replace(/-/gi, "_").trim()
		//  console.log(identificarUnico)
		
		if (fileExtension == ".mp4"){
			var newpath = 'videoupload/' + files.filetoupload.name
			var link = "<div class='videoBox'><video class='vdMural' controls> <source src='" + newpath + "' type='video/mp4'> </video> </div>  <div class='divVotacao'>   &nbsp; &nbsp; <img class='votar' onClick='votarSim(\""+ identificarUnico+"\")' src='imagem_comum/sim.jpg'  /> <div id='"+ identificarUnico +"_like'> &nbsp; </div>&nbsp; &nbsp;  <img class='votar' onClick='votarNao(\""+identificarUnico+"\")' src='imagem_comum/nao.jpg'/> &nbsp; <div id='"+identificarUnico+"_dislike'></div> &nbsp; </div>" + messageInAttach  
		}
		else{
			if (fileExtension == ".jpg" || fileExtension == ".jpeg" || fileExtension == ".png" || fileExtension == ".gif" || fileExtension == "" ){
				var newpath = 'fileuploadMural/' + files.filetoupload.name
				var link = "<div class='imageBox'> <img class='imgMural' src='" + newpath +"' alt='imagem' />   </div> <div class='divVotacao'>   &nbsp; &nbsp; <img class='votar' onClick='votarSim(\""+ identificarUnico+"\")' src='imagem_comum/sim.jpg'/> <div id='"+ identificarUnico +"_like'> &nbsp; </div> &nbsp; &nbsp; <img class='votar' onClick='votarNao(\""+identificarUnico+"\")' src='imagem_comum/nao.jpg'/>  &nbsp; <div id='"+identificarUnico+"_dislike'></div> &nbsp; </div> " + messageInAttach 
			}
			else{
				console.log("❌[ERROR] Tipo de arquivo não permitido: ["+fileExtension+"]")
				res.redirect('/mural')
				res.end()
				return false
			}
		}

		//console.log("messageInAttach"+ fields.messageInAttach)
		var oldpath = files.filetoupload.path;



		fs.copyFile(oldpath, newpath, function (err) {
			if (err) {
				console.log("❌ [ERROR] Erro ao salvar arquivo recebido. oldpath= ["+oldpath+"] -> newpath= ["+ newpath +"]")
				throw err
			}
			
			if (chat_add_message({message:link, username:username, identificador:identificarUnico, filepath:newpath }) ){
				// console.log("salvou com sucesso")
				//Inserindo a <img> no canal de message para aparecer no Mural.
			  io.sockets.emit('message', {message:link, username:username,  time:time, identificador:identificarUnico})
			}
			else {
				//console.log(" mensagem"+link)
			}
			res.redirect('/mural')
			res.end()
        });
		
		// fs.rename(oldpath, newpath, function (err) {

		// 	if (err) throw err
			
		// 	if (chat_add_message({message:link, username:username, identificador:identificarUnico, filepath:newpath }) ){
		// 		// console.log("salvou com sucesso")
		// 		//Inserindo a <img> no canal de message para aparecer no Mural.
		// 	  io.sockets.emit('message', {message:link, username:username,  time:time, identificador:identificarUnico})
		// 	}
		// 	else {
		// 		//console.log(" mensagem"+link)
		// 	}
		// 	res.redirect('/mural')
		// 	res.end()
		// })
	})
})

//para servir as imagens e videos que foram enviados via POST para a pasta no servidor fileuploadMural
app.get('/fileuploadMural/:file', function (req, res) {
	var path = require('path')
	var dir = ( './fileuploadMural')
    var file = req.params.file;

	var fileExtension = path.extname(file)
    var type = mime[file];

    var s = fs.createReadStream(dir+"/"+file)
    s.on('open', function () {
        res.set('Content-Type', type)
        s.pipe(res)
    })
    s.on('error', function () {
        res.set('Content-Type', 'text/plain')
        res.status(404).end('Not found')
    })
})

app.get('/audioupload/:file', function (req, res) {
	var path = require('path')
	var dir = ( './audioupload/')
    var file = req.params.file
   
    var type = mime[path.extname(file).slice(1)] || 'audio/ogg';
	var type = path.extname(file)
	// console.log("### app.get('/audioupload/:file' ###  FILE TYPE: "+type)

    var s = fs.createReadStream(dir+"/"+file)
    s.on('open', function () {
        res.set('Content-Type', type)
        s.pipe(res)
    })
    s.on('error', function () {
        res.set('Content-Type', 'text/plain')
        res.status(404).end('Not found')
    })
})

app.post('/post-audio/', (req, res) => {
	var form = new formidable.IncomingForm(req.formidable)
	form.parse(req, function (err, fields, files) {
		//  console.log(fields)

		 if (!files) return;
		var name = fields.fname
		var arquivo = files.file
		var from = fields.from
		var to = fields.to

		novoNome = arquivo.path
		remover = "/tmp/"
		novoNome = novoNome.substring(novoNome.indexOf(remover) + remover.length)
		var newpath = './audioupload/' + novoNome + '.ogg'

		let keys=Object.keys(files)
		fs.readFile(files[keys[0]].path,(err,e)=>{
			if(err) console.log(err)
			fs.writeFile(newpath,e,(err)=>{
					console.log(err)
			})
		})

		io.sockets.emit("audioTo",{audiosrc:newpath,from:from,to:to,time:new Date()})

		var audiotag = "<audio preload='auto' src='"+newpath+"' controls='1'></audio>"
		var message = "<p class='messageTo' style='text-align:right;margin-left:auto'><font color='gray'>" + new Date() + "</font>  <img class='miniAvatar' src='usersAvatar/"+from+"-user-icon.png'>  <br> "+ audiotag + " </p>"
		var identificarUnico = uuidv4()
		identificarUnico = identificarUnico.replace(/-/gi, "_").trim()
		addMessageContactToPerson({from:from, to:to, message:audiotag, time:new Date(), identificador:identificarUnico})
        
		res.status(200)		
		res.end()
	
	})
})

app.get('/videoupload/:file', function (req, res) {
	var path = require('path')

	var dir = ( './videoupload/')
    var file = req.params.file;
   
	var fileExtension = path.extname(file)
    var type = mime[file];

    var s = fs.createReadStream(dir+"/"+file)
    s.on('open', function () {
        res.set('Content-Type', type)
        s.pipe(res)
    })
    s.on('error', function () {
        res.set('Content-Type', 'text/plain')
        res.status(404).end('Not found')
    })
})

app.get("/votaram/:identificador/:escolha", function(req, res){
	var identificador = req.params.identificador
	var escolha = req.params.escolha
	//  console.log("votaram "+escolha+" na midia com uuid: "+ identificador)
	if (identificador && escolha){
		if (escolha == 'sim'){
				chatMessageController.votaramSim(identificador,function(total){
				res.status(200).end('votado Sim')
				io.sockets.emit("votosnamidia",{identificador:identificador,opcao:"like",qtde:total})
			})
		}
		if (escolha == 'nao'){
				chatMessageController.votaramNao(identificador,function(total){
					console.log("total de votos = ") 
					console.log(total)
					res.status(200).end("Sucesso: votado NAO identificador["+identificador+"]")
					io.sockets.emit("votosnamidia",{identificador:identificador, opcao:"dislike", qtde:total})

					if(total%10==0) {
						console.log("vou começar a evitar identificador["+identificador+"] total="+total)
						evitarNoMural(identificador)
					} 
				})
		}
	}
})

function evitarNoMural(identificador){
	chatMessageController.pesquisar({identificador:identificador}, function (data){
		if (data.error){
			// console.log("Erro: deu ruim ao pesquisar o identificador para evita-lo")
			// console.log(data.error)
			return false
		}
		else {
			evite.searchEviteByIdentificador(identificador, function(doc){
				if (doc.error){ //if error, signigica que nao achou, deve salva-lo com ranking=1

					evite.save({identificador:data.identificador,votosnao:data.votosnao, ranking: 1, filepath:data.filepath, from:data.username }, function (callback){
						if (callback.error){
							// console.log("Error: Nao foi possivel salvar o evite do identificador["+identificador+"] na evitarNoMural()")
							// console.log(callback.error)
							return false
						}
						else {
							// console.log("Sucesso: salvo evite para o identificador["+identificador+"]")
							// console.log("callback = ") 
							//console.log(callback)
						}
	
					})
					
				}
				else{
					// console.log("SALVANDO o incremente para o identificador")

					evite.incRanking({identificador:data.identificador}, function (callback){	
						// console.log("callback = ") 
						// console.log(callback)
						// console.log("SALVO o incremente para o identificador")

						
					})

				}
				
				
			}
			)
			

			}
	})
}

/////////////////////
//VERIFICAR ESSA ROTA
app.post('/api/repo/:name', (req, res) => {
	const reponame = req.params.name
	console.log("reponame:"+reponame)
	command = '/bin/bash -c "/root/git/devops-tools/commons/create-repo.sh ' + reponame +'"'
	console.log( 'criando repositorio ["/root/git/devops-tools/commons/create-repo.sh ' + reponame + '"]')
	const { exec } = require('child_process')
	exec(command, (err, stdout, stderr) => {
          console.log(stdout)
          res.json(stdout)
          res.end()
  })

})


// ROTA PARA APAGAR UM ARQUIVO
app.get('/deletefile/:filename', (req,res) => {
	
		const filename = req.params.filename
		const path = "./fileupload/"

		try {
			fs.unlinkSync(path+filename)
			console.log("☢ [INFO] Arquivo apagado com sucesso: ["+path+filename+"]")
			//collector.collect(res)
		} catch(err) {
			//prometheus metrics
			//collector.collect(err)
			console.error(err)
			console.log("❌[ERROR] Falha ao tentar apagar o arquivo ["+filename+"] na pasta: "+path)
			
		}
//	console.log("Arquivo apagado "+req.params.filename)
	res.redirect('./../upload')
})

 //################
 //#              #
 //# OLD REST API #
 //#              #
 //################

app.get ('/rest/projetos/list/',function (req,res) {
		res.json(projetos)
        res.end()
})



app.get ('/rest/farms/list/',function (req,res) {
		res.json(farms)
        res.end()
})


app.get ('/rest/roles/list/',function (req,res) {
		res.json(roles)
        res.end()
})


app.get ('/rest/message/:ativo',function (req,res) {
	const ioclient = require("socket.io-client")
	var socketclient = ioclient.connect('http://servidorpush.antidrone.com.br:3000')
	//fileupload
	var ativo = req.params.ativo;
		html="Mensagem: " + ativo ;
		history = history + ativo;
        //res.writeHeader(200, {"Content-Type": "text/html"})
        res.writeHeader(200, {"Content-Type": "application/text"})
        res.write(html)
        res.end()
		socketclient.emit('message', {message : ativo , username : socketclient.username})
})



app.get ('/rest/chat/list/',function (req,res) {
//        res.writeHeader(200, {"Content-Type": "text/json"})
		res.json(chatMessage)
        res.end()
})



app.get ('/rest/chat/add/:username/:messageText',function (req,res) {
	
		chat_add_message({username:req.params.username, message:req.params.messageText, identificador:uuidv4})
  		res.json(chatMessages)
        res.end()
})



app.get ('/rest/chat/del/:messageId',function (req,res) {

		var chatMessages_filter = [];

		for (i = 0; i < chatMessages.length; ++i) {
	    	if (chatMessages[i].id == req.params.messageId) {
				console.log("DELETED CHAT MESSAGE[ " +i+ " ] = " + chatMessages[i].text + "")
		    }
		    else{
				chatMessages_filter.push(chatMessages[i])
			}
		}
		chatMessages = chatMessages_filter;
		res.json(chatMessages)
		res.end()
})


app.get ('/rest/nodes/',function (req,res) {
		//console.log(nodes)
        res.json(nodes)
        res.end()
})


app.get ('/rest/hostconfig/:hostname',function (req,res) {
		for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == req.params.hostname) {
			        var hostconfig = nodes[i].hostconfig;
					console.log("H: " + hostconfig)
        			res.json(hostconfig)
					res.end()
					return;
		   }
		}
					console.log("ACHEINADA("+hostname+")")
		res.json({})
        res.end()
})


app.post ('/rest/hostconfig/:hostname/autoupdate/:autoupdate',function (req,res) {
	if ( req.params.autoupdate == "undefined"  || req.params.hostname == "undefined" )  {
		res.json({})
		res.end()
		return;
	}

	for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == req.params.hostname) {
			        nodes[i].hostconfig.autoupdate = req.params.autoupdate;
        			res.json({"exitcode":0})
					res.end()
					return;
		   }
	}

	res.json({"exitcode":1})
    res.end()
})


app.post ('/rest/hostconfig/:hostname/mainfunction/:mainfunction',function (req,res) {
	if ( req.params.mainfunction == "undefined"  || req.params.hostname == "undefined" )  {
		res.json({})
		res.end()
		return;
	}

	for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == req.params.hostname) {
			        nodes[i].hostconfig.mainfunction = req.params.mainfunction;
        			res.json({"exitcode":0})
					res.end()
					return;
		   }
	}

	res.json({"exitcode":1})
    res.end()
})


app.get ('/rest/commands/',function (req,res) {
					console.log("Commandos: " + commands)
        			res.json(commands)
					res.end()
					return;
})

app.get ('/rest/commands/set/:id/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;

		console.log("Command: " + command)
	      commands[id].command = req.params.command ;
			console.log("SET COMMANDS[ " +id + " ] = " + req.params.command + "")


		res.json({})
		res.end()
})

app.get ('/rest/commands/del/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;
		var obj = {command:command};
		var commands_filter = [];


		for (i = 0; i < commands.length; ++i) {
	      if (commands[i].command == req.params.command) {
			//delete commands[i];
			console.log("DEL COMMANDS[ " +id + " ] = " + req.params.command + "")
		   }
		   else
			   {
				   commands_filter.push(commands[i])
			   }
		}
		commands = commands_filter;
		fs.writeFileSync(commands_json, JSON.stringify(commands))
		res.json({})
		res.end()
})


app.get ('/rest/commands/add/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;

		var obj = {command:command};
	      //commands[id].command = req.params.command ;
	      commands.push(obj) ;
			console.log("ADD COMMANDS[ " +id + " ] = " + req.params.command + "")

		fs.writeFileSync(commands_json, JSON.stringify(commands))
		res.json({})
		res.end()
})


app.get ('/rest/commands/execute/:command',function (req,res) {

		var command = req.params.command;

		console.log("Command: " + command)
		for (i = 0; i < commands.length; ++i) {
	      if (commands[i].command == req.params.command) {
				const { exec } = require('child_process')
     		   	exec(command, (err, stdout, stderr) => {
        		res.json(stdout)
				res.end()
			    })
			console.log("EXECUTING: [" + req.params.command + "]")
			return;
		   }
		}
		console.log("☣☠ [ALERT]: Tentativa de execução de comando NAO AUTORIZADO: ["+req.params.command + "]\n COMMANDS["+i+"] = "+commands )
		res.json({})
		res.end()
})

app.get ('/rest/hostexec/:hostname/:command',function (req,res) {

		var command = req.params.command;
		var hostname = req.params.hostname;

		console.log("[INFO] Command: " + command)
		for (i = 0; i < commands.length; ++i) {
	      if (commands[i].command == req.params.command) {
				const { exec } = require('child_process')
     		   	exec("/root/shell/push/hostexec.js " + hostname + " '" + command + "'", (err, stdout, stderr) => {
				if (stdout == "\n"){
					res.write("#")
				}
				else{
					res.write(stdout)
				}
				res.end()
			    })
			return;
		   }
		}
		console.log("☣☠ [ALERT]: Tentativa de execução de comando NAO AUTORIZADO:  ["+req.params.command + "]\n COMMANDS["+i+"] = "+commands )
		res.end()
})


/*#########################################
###########################################
##
## 		WEB SOCKET
##
###########################################
#########################################*/







//listen on every connection
io.on('connection', (socket) => {
	if (debug) console.log('--> \n  #########################\n  # New user: ' + socket.username + ' ' )
	if (debug) console.log("  # Conn.ID: " + socket.client.conn.id + "(" + socket.client.conn.remoteAddress + ") \n  ########################\n" )

	//default username
	//socket.username = "Chatops"
	socket.hostname = "container.docker";
	

    //listen on change_username
    socket.on('username', (data) => {
		//console.log("chamando a socket.on('username');");	
		socket.username = data.username
		if (debug) console.log(' ## New USER (' + socket.username +") CONNECTED on Websocket channel: username" )
		username = data.username;
		//if (!logged_users.includes(username))
			logged_users.push(username);	
		io.sockets.emit('newlogin', { message : data.message})
    })
 
	socket.on("disconnect", (reason) => {
		if (debug)	console.log("  ####################")
		if (debug)	console.log("  # Closing Websocket | Reason: "+reason)
		if (debug) console.log("  # USER (" +socket.username +") ")
		if (debug) console.log("  # Conn.ID: " + socket.client.conn.id + "(" + socket.client.conn.remoteAddress + ")" )
		if (debug) console.log("<-- Socket Disconnect  ")
		if (debug) console.log("### POP: "+ socket.username)

		if (socket.username != undefined ){
			//remove somente a primeira ocorrencia do usuário que fechou a tela de login, se houver outras, que permacecam no array.
			const idx = logged_users.indexOf(socket.username)
			logged_users.splice(idx, idx !== -1 ? 1 : 0)
		
			//manda chamar a newlogin que atualizara todos que ainda estão lá.
			io.sockets.emit('newlogin', { username : socket.username})
		}
		// var clients_in_the_room = io.sockets.adapter.rooms['contactTo'];
		// for (var clientId in clients_in_the_room ) {
		//   console.log('client: %s', clientId); // Seeing is believing
		//   var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this
		// }
		
		io.sockets.emit('newlogin', { username : socket.username})
	})

    socket.on('hostversion', (data) => {
        socket.hostversion = data.message
		hostname = data.hostname
		hostconfig = data.hostconfig
		console.log(" FUNCAO PRINCIPAL DESSE SERVIDOR(mainfunction) ...  \"hostconfig\":"+JSON.stringify(hostconfig))
		socket.emit('message', { message : data.message})
		var i
		for (i = 0; i < nodes.length; ++i) {
			//procurando a posicao certa para fazer a atualicao.
	      if (nodes[i].hostname == hostname) {
			        nodes[i].version = data.message
					nodes[i].hostconfig = data.hostconfig
					//fez a atualizacao sai fora, senao lá em baixo vai criar um novo denovo.
		   			return
		   }
		}
		nodes.push({ hostname: hostname, version: data.message, hostconfig: data.hostconfig})
    })


    //quando chegar [message], verifica se é igual a uma dessas data.message e responde no [message]
    socket.on('message', (data) => {

		//PROMETHEUS OBSERVABILITY
		messagesTotal.inc({ add_user_message: data.username }) 

	  	hostname = data.hostname
		time = new Date()
	  	
      //broadcast the new message
      io.sockets.emit('message', {message: data.message, username: socket.username, time:time, identificador:data.identificador})

	  chat_add_message({message:data.message, username:socket.username, identificador:data.identificador })

	  //dependendo do texto enviado na mensagem, responder com determinadas ações:
		if (data.message == "getnodes"){
			const { exec } = require('child_process')
			exec('cd /root/shell ; /root/shell/linux/Getnodes.sh ', (err, stdout, stderr) => {
        		stdout = convert.toHtml(stdout)
		    	socket.emit('message', { message : "getnodes: <hr>[ " + stdout + "]", username : "evolua.bot", time:time })
			})
		}
	  	if (data.message == "help"){
   			io.sockets.emit('message', {message : "<br>Olá boa tarde, "+
                                             "estou preparado para atender os comandos: <br> "+
                                             "* deploy  -> inicia o deploy cdshell <br>"+
                                             "* version -> exibe a versao do cdshell <br>"+
                                             "* date    -> retorna a data ", username : "evolua.bot" , time:time})
		}
		if (data.message == "lula"){
			io.sockets.emit('message', {message : "<br>Ladrao de bosta, "+
										  "estou preparado para atender os comandos: <br> "+
										  "* deploy  -> inicia o deploy cdshell <br>"+
										  "* version -> exibe a versao do cdshell <br>"+
										  "* date    -> retorna a data ", username : "evolua.bot" , time:time})
	 }


        if (data.message == "ntp"){
			  io.sockets.emit('command', {message : "ntp ntp.cais.rnp.br", username : socket.username, time:time})
      	}
		if (data.message == "version"){
		    const { exec } = require('child_process')
     	    exec('cd /root/shell ; /root/shell/linux/cdshell -V', (err, stdout, stderr) => {
               socket.emit('message', { message : "<br> Versão do CDSHELL no servidor: [" + stdout + "]", username: "evolua.bot", time:time  })
	        })
		}	
		
		
    })

	socket.on('contactTo', (data) => {
		data.time = new Date()
        io.sockets.emit('contactTo', data)
		if ((data.from != undefined) && (data.toContact != undefined) && (data.message != undefined) ){
			addMessageContactToPerson({from:data.from, to:data.toContact, message:data.message,time:data.time,identificador:data.identificador})
		}
		else
			console.log("error on:contactTo = faltou from, to, ou message")
    })

	socket.on('offerLive', (data,peerId) => {
		addMessageContactToPerson({from:data.from, to:data.toContact, message:data.message,time:data.time,identificador:data.identificador})

		//injetada de dados no meio do envio do offerLive, salvando primeiro sem o icone da imagem no banco e mostrando nas telas chamando sempre a ultima mensagem.
		data.message = "<img style='display:block; height:30px; width:30px' src='imagem_comum/webcallreceiving.gif'>" + data.message
        io.sockets.emit('offerLive', data,peerId)
    })

	socket.on('liveAccepted', (obj) => {
        io.sockets.emit('liveAccepted', obj)
    })

	socket.on('command', (data) => {
		console.log("channel command: "+data.message)
		const { exec } = require('child_process')
     	    exec(data.message, (err, stdout, stderr) => {
               io.sockets.emit('message', { message: "Saida do comando: [ " + stdout + "]", username: "ChatBot", time:new Date() })
	        })
    })

	socket.on('sair', (data) => {
        socket.emit('sair', {message : data.message, username : socket.username, time: data.time})
    })

	socket.on('version', (data) => {
		   if (data.message == "hostversion")
         		socket.emit('message', { message : data.message, username: socket.username, time: data.time })
		   
		   if (data.message == "CDSHELL"){
			   const { exec } = require('child_process')
     		 	exec('cd /root/shell ; /root/shell/linux/cdshell -g', (err, stdout, stderr) => {
        	   socket.emit('message', { message : stdout, username:"ChatBot", time: data.time })
	       })
		   }
		   if (data.message == "sistemas"){
			 //io.sockets.emit('command', {message : "ntpdate ntp.cais.rnp.br", username : socket.username})
			   const { exec } = require('child_process')
     		 exec('cd /root/sistemas ; /root/shell/linux/cdshell -g', (err, stdout, stderr) => {
        		socket.emit('message', { message : stdout })
	       })
		   }

    })

    //listen on typing
    socket.on('typing', (data) => {	socket.broadcast.emit('typing', data);  })
 	socket.on('hostexec', (data) => { io.sockets.emit('hostexec', {hostname : data.hostname, command: data.command}); })
	socket.on('distribute_log', (data) => { io.sockets.emit('log.'+data.hostname, {saida:data.saida}); })
	socket.on('release', (data) => {	socket.broadcast.emit('release', data);  })

	socket.on("newlogin",(username) => { io.sockets.emit('newlogin', username); })
	socket.on("audio",(media) => {
		media.time = new Date()
		io.sockets.emit('audio', media); 
	})
})


//promtheus with socket.io metrics 
//prometheus.metrics(io)
const ioMetrics = prometheus.metrics(io, {
	collectDefaultMetrics: true,
	checkForNewNamespaces: false
})
//const metrics = ioMetrics.register.metrics()


  // Faz uma chamada na inicialização da  sistemas/servidorPush/ <- ./version para anunciar a versão pro Getnodes.sh
  const { exec } = require('child_process')
  exec("cd /root/shell/push ; ./version.js ", (err, stdout, stderr) => {})
