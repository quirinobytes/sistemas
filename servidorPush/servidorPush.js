#!/usr/bin/env node

//mongo config
var db = require('./config/db_config.js');
var chatMessageModel = require('./models/chatMessage');
var chatMessageController = require('./controllers/chatMessagesController');



//prometheus / sockket.io
const prometheus = require ('socket.io-prometheus-metrics')


//prometheus metrics
const apiMetrics = require('prometheus-api-metrics')
// const HttpMetricsCollector = require('prometheus-api-metrics').HttpMetricsCollector;
// const collector = new HttpMetricsCollector();


//const promBundle = require("express-prom-bundle");
const Prometheus = require('prom-client')
const messagesTotal = new Prometheus.Counter({
	name: 'messages_total',
	help: 'Total number of user\'s messages',
	labelNames: ['add_user_message']
});


// usado retorno do content-type para envio de anexos permitidos.
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
}

var Convert = require('ansi-to-html');
//opcoes para o convert ANSI COLOR to HTML criar nova linha tmb
var convert = new Convert({
    fg: '#FFF',
    bg: '#000',
    newline: true,
    escapeXML: false,
    stream: false
})


var fs = require('fs')
var commands_json = './comandos.json'
var commandsJsonFile = fs.readFileSync(commands_json)
var commands = JSON.parse(commandsJsonFile)
//var commands = [{ command: "ping 8.8.8.8 -c1"},{command: "/root/shell/push/deploy.js deploy"},{command:"/root/shell/push/command.js 'wall rafael'"},{command:"hostname"}];

// Formidable para upload de arquivos
var formidable = require('formidable')

// Layout do ejs
var expressLayouts = require('express-ejs-layouts')


const express = require('express');
const id = require('faker/lib/locales/id_ID');
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
// });



var history="";
var nodes=[];

//var json = '{"messages":[{"Id":01,"username":"Rafael","text":"Mustang"},{"Id":02,"username":"Bia","text":"Oi Rafael, vc está bem?"},{"Id":03,"username":"Tali","text":"Oi Rafiusks... eai conseguiu terminar, meu vc ficou ate tarde"}]}';
//var chatMessages = [{id:01,"username":"Rafael","text":"Mustang"},{id:02,"username":"Bia","text":"Oi Rafael, vc está bem?"},{id:03,"username":"Tali","text":"Oi Rafiusks... eai conseguiu terminar, meu vc ficou ate tarde"}];
var chatMessages = [];
var chatMessageId = 0;
var projetos = [{id:01,"name":"shell","apelido":"CDSHELL","desc":"Esse projeto é sobre o CDSHELL","farms":"cdshell_FARM","equipe":"BackEnd-Nodejs"},{id:02,"name":"workspace","apelido":"My Workspace","desc":"Esse projeto contém todo meu Wrokspace Atual","farms":"workspace_FARM","equipe":"BackEnd-Nodejs,FrontEnd-Angular,ArtificalInteligence"}];
var farms = [{id:01,"name":"cdshell_FARM","apelido":"CDSHELL FARM","desc":"Esse projeto é sobre o CDSHELL","nodes":["dev1","dev2"]},{id:02,"name":"workspace_FARM","apelido":"WK FARM","desc":"Esse projeto é sobre o WORKSPACE","nodes":["dev3","dev4"]}];
var roles = [{id:01,"name":"frontend","apelido":"Servidores Front-End","icon":"https://visualpharm.com/assets/896/Cisco%20Router-595b40b75ba036ed117d8b7b.svg"},{id:02,"name":"backend","apelido":"Servidores Back-End","icon":"https://visualpharm.com/assets/419/Hub-595b40b75ba036ed117d8d05.svg"},{id:03,"name":"Nas","apelido":"Servidores NAS","icon":"https://visualpharm.com/assets/761/Nas-595b40b75ba036ed117d8dcd.svg"}];
var logged_users = [];
var lastMessageFrom = []

var privadoChat = {admin_bahia:[[{}]], bahia_admin:[[{}]], admin_spitz:[[{}]],spitz_admin:[[{}]],  admin_rafael:[[{}]],rafael_admin:[[{}]], bahia_rafael:[[{}]],rafael_bahia:[[{}]], bahia_spitz:[[{}]],spitz_bahia:[[{}]],marcia_rafael:[[{}]], rafael_marcia:[[{}]] ,marcia_admin:[[{}]], admin_marcia:[[{}]], spitz_rafael:[[{}]], rafael_spitz:[[{}]]  };
var destino = {}
var destino2 = {}



function loadMuralHistoryFs2Json(){
	// rawdata = fs.readFileSync('chatMessages.json');
	// chatMessages = JSON.parse(rawdata);
	// console.log(chatMessages);

	// chatMessageController.ultimos10(valor,function(resp){
	// 	//	res.json(resp);
	// 	valor = valor + 10
	// 	console.log(resp)
	// 	chatMessages = resp
	// })
	
}

function loadPrivadoHistoryFs2Json(){
	rawdata = fs.readFileSync('privadoChat.json');
	privadoChat = JSON.parse(rawdata);
	// console.log(chatMessages);
}

function writeMuralHistoryJson2Fs(){
		const data = JSON.stringify(chatMessages)
		fs.writeFile('chatMessages.json', data, err => {
		if (err) {
			throw err
		}
		})
}

function writePrivadoHistoryJson2Fs(){
	const data = JSON.stringify(privadoChat)
	fs.writeFile('privadoChat.json', data, err => {
		if (err) {
			throw err
		}
	// console.log('JSON data is saved.')
	})
}

loadMuralHistoryFs2Json()
loadPrivadoHistoryFs2Json()

// function that check for basic auth header and return the username base64 decoded.
function getUsernameFromHeadersAuthorization(req){
	// verify auth credentials <- Aqui eu pego as credenciais para uso no kong
	//username = '';
	if (!req.headers.authorization)  return null
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    let [user, password] = credentials.split(':');
	//console.log(" # _log: getUsernameFromHeadersAuthorization()\n username:"+user+ "\n #")
	return user;
}

function chat_add_message({username,message,time}){
	if (time!="") dateTime = new Date();
	newMessage = {id:chatMessageId,username:username,message:message,time:dateTime};
	chatMessageId++;
	chatMessages.push(newMessage);

	if (username!==undefined) {
	//incrementando o contador do metrics do prometheus
	messagesTotal.inc({
		add_user_message: username
	  })
	}

	//chatmessages igual a Mural messages
	writeMuralHistoryJson2Fs()
	chatMessageController.save(chatMessageId,username,message,time,function(resp){
	//	res.json(resp);
	//console.log(resp)
	})
	return chatMessages;
}

function findValueByPrefix(object, prefix) {
	for (var property in object) {
	  if (object.hasOwnProperty(property) && 
		 property.toString().startsWith(prefix)) {
		 return object[property];
	  }
	}
  }


function addMessageContactToPerson(de,para,mensagem,time){
	//se nao tiver carregado um board para falar com alguem, aqui pode ficar sem um para
	if (!para)
	 	return;
	if (!time)
		dateTime = new Date();
	else
		dateTime = time;
	
	prefix = de+"_"+para;
	prefixinv = para+"_"+de;

	destino = findValueByPrefix(privadoChat,prefix);
	//console.log(destino);
	//console.log(destino2);
	destino2 = findValueByPrefix(privadoChat,prefixinv);
	destino.push([{from:de,to:para,message:mensagem,time:dateTime}])
	destino2.push([{from:de,to:para,message:mensagem,time:dateTime}])

	writePrivadoHistoryJson2Fs()
}

//############################################################

//Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)



//set the template engine ejs
app.set('view engine', 'ejs')
//usando o layout do EJS
app.use(expressLayouts)
//middlewares
app.use(express.static('images'))
app.use(express.static('public'))
app.use(express.static('public/js'))
app.use(express.static('public/jquery'))

app.use(express.static('lib/css'))
app.use(express.static('lib/js'))
app.use(express.static('lib'))






// create /metrics and add the prometheus middleware to all routes
//app.use(metricsMiddleware)

//collect HTTP Api metrics/duration
//app.use(apiMetrics())
app.use(apiMetrics({
	additionalLabels: ['user', 'ip'],
	extractAdditionalLabelValuesFn: (req, res) => {
		const headers = req.headers.authorization;
		
//		console.log("#METRICS " +req.host +" | " + req.headers.authorization);
//		console.log(req);
//		console.log(authorization);
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

//route /
app.get('/mural', (req, res) => {
	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') {nome = "anonymous"}
	res.render('mural',{usuario:nome })
})

app.get('/ultimos10/:apos', (req, res) => {
	var aposX = req.params.apos;
	// console.log("quero chatMessages APOS ["+aposX+"] itens agora")

	chatMessageController.ultimos10(parseInt(aposX),function(resp){
		//	res.json(resp);
		var array = []
		if (resp)
			resp.forEach(function(item){
				array.push(item._doc)
				//console.log(item._doc)
			})
		res.json(array)
		res.end();
	})
})




//route /contact
app.get ('/privado',function (req,res) {
	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') {nome = "anonymous"}
	//console.log("user:"+nome);
	res.render('privado',{usuario:nome })
})

//route /logged_users
app.get ('/logged_users',function (req,res) {
	//console.log(logged_users);
	res.json(logged_users);
})


app.get ('/rest/loadChatWith/:from/:to',function (req,res) {
	const from = req.params.from;
	const to = req.params.to;

	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') {nome = "anonymous"}

	//console.log("GET no /rest/loadChatWith/"+from+"/"+to);
	prefix = from + "_" + to;
	obj = findValueByPrefix(privadoChat,prefix)
	// console.log(obj);
	res.send(obj);
})

//route /upload
app.get('/upload', (req, res) => {

	nome = getUsernameFromHeadersAuthorization(req)
	if (nome == '') nome = "anonymous"

	path = "./fileupload/";
	//abre o diretorio path e renderiza para o ejs renderizar o arquivo upload.ejc com a var items
	fs.readdir(path, (err, files) => res.render('upload', { usuario:nome, items: files }  ));
})

app.post('/fileupload', (req, res) => {
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		var oldpath = files.filetoupload.path;
		var newpath = './fileupload/' + files.filetoupload.name;
		fs.rename(oldpath, newpath, function (err) {

		if (err) throw err;
			//prometheus metrics
			//collector.collect(err || res);
			//res.write('File uploaded and moved!');
			res.redirect('./upload')
			res.end();
		});
	});
})




// recebe o post de enviar arquivos de FOTOS E VIDEOS, salva e grava a TAG HTML correta.
app.post('/fileuploadMural/',  (req, res) => {

	var options = { maxFileSize: '25mb' }
	var form = new formidable.IncomingForm(options)

	form.parse(req, function (err, fields, files) {
		if (err) throw err;

		if (!files.filetoupload.name) return;
		
		filename = files.filetoupload.name
		let results = filename.replace('\n', '').split('.')
		let tipoArquivo = results[1].trim()

		var username = fields.usuario
		var time = fields.time
		var messageInAttach = fields.messageInAttach

		if (tipoArquivo == "mp4"){
			var newpath = 'videoupload/' + files.filetoupload.name
			var link = "<div class='videoBox'>  <video class='vdMural' controls> <source src='" + newpath + "' type='video/mp4'>  " + messageInAttach + "</video>  </div>"
		}
		else{
			if (tipoArquivo == "jpg" || tipoArquivo == "jpeg" || tipoArquivo == "png"){
				var newpath = 'fileuploadMural/' + files.filetoupload.name
				var link = "<p class='message'> <div class='imageBox'> <img class='imgMural' src='" + newpath +"' alt='imagem' /> " + messageInAttach + " </div> </p>"
			}
		}

		//console.log("messageInAttach"+ fields.messageInAttach)
		var oldpath = files.filetoupload.path;
		
		fs.rename(oldpath, newpath, function (err) {

			if (err) throw err;
			
			//Inserindo a <img> no canal de message para aparecer no Mural.
			chat_add_message({message : link, username:username, time:time })
			io.sockets.emit('message', {message : link , username: username,  time:time})

			res.redirect('/mural')
			res.end()
		});
	});
})


//para servir as imagens e videos do fileuploadMural
app.get('/fileuploadMural/:file', function (req, res) {
	var path = require('path');
	var dir = ( './fileuploadMural');
    var file = req.params.file;
   
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(dir+"/"+file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
		
		//res.redirect('/')
		//res.end();
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
})


app.get('/audioupload/:file', function (req, res) {
	var path = require('path');
	var dir = ( './audioupload/');
    var file = req.params.file;
   
    var type = mime[path.extname(file).slice(1)] || 'audio/ogg';
    var s = fs.createReadStream(dir+"/"+file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
		
		//res.redirect('/')
		//res.end();
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
})

app.post('/upload-audio/', (req, res) => {

	var form = new formidable.IncomingForm(req.formidable);

	form.parse(req, function (err, fields, files) {

		// console.log(fields)

		 if (!files) return;
				
		var name = fields.fname
		var arquivo = files.file
		// console.log("name: "+name)
		// console.log("tamanho: "+ arquivo.size)
		// console.log("nome: "+arquivo.name)
		// console.log("tipo: "+arquivo.type) 
		// console.log("path: "+arquivo.path) 
		// console.log("FD: "+arquivo._writeStream.fd)


		novoNome = arquivo.path
		remover = "/tmp/"
		novoNome = novoNome.substring(novoNome.indexOf(remover) + remover.length);
		//console.log("novo Nome: "+novoNome)
		var newpath = './audioupload/' + novoNome + '.ogg'

		// var newpath = './audioupload/' + arquivo.name + '.ogg';
		// fs.writeFile(novoNome, arquivo, function (err) {
 		// 	if (err) throw err;

		// 	 console.log("GRAVOU")
		// });
	
		//console.log(files)
		let keys=Object.keys(files);
		fs.readFile(files[keys[0]].path,(err,e)=>{
			if(err) console.log(err);
			fs.writeFile(newpath,e,(err)=>{
					console.log(err)
			})
		})
		io.sockets.emit('audio', {src: newpath})
		//var link = "<p class='message'> <div class='imageBox'> <img src='" + newpath +"' alt='imagem' />  " + messageInAttach + " </div> </p>"
		
		addMessageContactToPerson("rafael", "bahia", "<audio> <source src='/" + newpath + "' type='audio/ogg'> </audio>", new Date() )
		//res.redirect('/')
		// res.end()
	
	});


})



app.get('/videoupload/:file', function (req, res) {
	var path = require('path');
	var dir = ( './videoupload/');
    var file = req.params.file;
   
    var type = mime[path.extname(file).slice(1)] || 'video/mp4"';
    var s = fs.createReadStream(dir+"/"+file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
		
		//res.redirect('/')
		//res.end();
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
})


/////////////////////
//VERIFICAR ESSA ROTA
app.post('/api/repo/:name', (req, res) => {
	const reponame = req.params.name
	console.log("reponame:"+reponame)
	command = '/bin/bash -c "/root/git/devops-tools/commons/create-repo.sh ' + reponame +'"'
	console.log( 'criando repositorio ["/root/git/devops-tools/commons/create-repo.sh ' + reponame + '"]')
	const { exec } = require('child_process');
	exec(command, (err, stdout, stderr) => {
          console.log(stdout)
          res.json(stdout);
          res.end();
  });

})


// ROTA PARA APAGAR UM ARQUIVO
app.get('/deletefile/:filename', (req,res) => {
	
		const filename = req.params.filename
		const path = "./fileupload/"

		try {
			fs.unlinkSync(path+filename)
			console.log("Arquivo apagado="+filename)
			//collector.collect(res);
		} catch(err) {
			//prometheus metrics
			//collector.collect(err);
			console.error(err)
		}
//	console.log("Arquivo apagado "+req.params.filename)
	res.redirect('./../upload')
})

            //###############
			//#             #
			//#   REST API  #
			//#             #
			//###############

app.get ('/rest/projetos/list/',function (req,res) {
		res.json(projetos);
        res.end();
});



app.get ('/rest/farms/list/',function (req,res) {
		res.json(farms);
        res.end();
});


app.get ('/rest/roles/list/',function (req,res) {
		res.json(roles);
        res.end();
});


app.get ('/rest/message/:ativo',function (req,res) {
	const ioclient = require("socket.io-client")
	var socketclient = ioclient.connect('http://servidorpush.antidrone.com.br:3000')
	//fileupload
	var ativo = req.params.ativo;
		html="Mensagem: " + ativo ;
		history = history + ativo;
        //res.writeHeader(200, {"Content-Type": "text/html"});
        res.writeHeader(200, {"Content-Type": "application/text"});
        res.write(html);
        res.end();
		socketclient.emit('message', {message : ativo , username : socketclient.username});
})



app.get ('/rest/chat/list/',function (req,res) {
//        res.writeHeader(200, {"Content-Type": "text/json"});
//        res.write(chatMessages.text);
		res.json(chatMessages);
        res.end();
})



app.get ('/rest/chat/add/:username/:messageText',function (req,res) {
		chat_add_message({username:req.params.username, message:req.params.messageText});
  		res.json(chatMessages);
        res.end();
})



app.get ('/rest/chat/del/:messageId',function (req,res) {

		var chatMessages_filter = [];

		for (i = 0; i < chatMessages.length; ++i) {
	    	if (chatMessages[i].id == req.params.messageId) {
				console.log("DELETED CHAT MESSAGE[ " +i+ " ] = " + chatMessages[i].text + "");
		    }
		    else{
				chatMessages_filter.push(chatMessages[i]);
			}
		}
		chatMessages = chatMessages_filter;
		res.json(chatMessages);
		res.end();
})


app.get ('/rest/nodes/',function (req,res) {
		//console.log(nodes);
        res.json(nodes);
        res.end();
});


app.get ('/rest/hostconfig/:hostname',function (req,res) {
		for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == req.params.hostname) {
			        var hostconfig = nodes[i].hostconfig;
					console.log("H: " + hostconfig);
        			res.json(hostconfig);
					res.end();
					return;
		   }
		}
					console.log("ACHEINADA("+hostname+")");
		res.json({});
        res.end();
})


app.post ('/rest/hostconfig/:hostname/autoupdate/:autoupdate',function (req,res) {
	if ( req.params.autoupdate == "undefined"  || req.params.hostname == "undefined" )  {
		res.json({});
		res.end();
		return;
	}

	for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == req.params.hostname) {
			        nodes[i].hostconfig.autoupdate = req.params.autoupdate;
        			res.json({"exitcode":0});
					res.end();
					return;
		   }
	}

	res.json({"exitcode":1});
    res.end();
})


app.post ('/rest/hostconfig/:hostname/mainfunction/:mainfunction',function (req,res) {
	if ( req.params.mainfunction == "undefined"  || req.params.hostname == "undefined" )  {
		res.json({});
		res.end();
		return;
	}

	for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == req.params.hostname) {
			        nodes[i].hostconfig.mainfunction = req.params.mainfunction;
        			res.json({"exitcode":0});
					res.end();
					return;
		   }
	}

	res.json({"exitcode":1});
    res.end();
})


app.get ('/rest/commands/',function (req,res) {
					console.log("Commandos: " + commands);
        			res.json(commands);
					res.end();
					return;
})

app.get ('/rest/commands/set/:id/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;

		console.log("Command: " + command);
	      commands[id].command = req.params.command ;
			console.log("SET COMMANDS[ " +id + " ] = " + req.params.command + "");


		res.json({});
		res.end();
})

app.get ('/rest/commands/del/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;
		var obj = {command:command};
		var commands_filter = [];


		for (i = 0; i < commands.length; ++i) {
	      if (commands[i].command == req.params.command) {
			//delete commands[i];
			console.log("DEL COMMANDS[ " +id + " ] = " + req.params.command + "");
		   }
		   else
			   {
				   commands_filter.push(commands[i]);
			   }
		}
		commands = commands_filter;
		fs.writeFileSync(commands_json, JSON.stringify(commands));
		res.json({});
		res.end();
})


app.get ('/rest/commands/add/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;

		var obj = {command:command};
	      //commands[id].command = req.params.command ;
	      commands.push(obj) ;
			console.log("ADD COMMANDS[ " +id + " ] = " + req.params.command + "");

		fs.writeFileSync(commands_json, JSON.stringify(commands));
		res.json({});
		res.end();
})


app.get ('/rest/commands/execute/:command',function (req,res) {

		var command = req.params.command;

		console.log("Command: " + command);
		for (i = 0; i < commands.length; ++i) {
	      if (commands[i].command == req.params.command) {
				const { exec } = require('child_process');
     		   	exec(command, (err, stdout, stderr) => {
        		res.json(stdout);
				res.end();
			    });
			console.log("EXECUTING: [" + req.params.command + "]");
			return;
		   }
		}
		console.log("ERROR: TENTATIVA DE EXECUCAO DE COMANDO: ["+req.params.command + "]\n COMMANDS["+i+"] = "+commands );
		res.json({});
		res.end();
})

app.get ('/rest/hostexec/:hostname/:command',function (req,res) {

		var command = req.params.command;
		var hostname = req.params.hostname;

		console.log("Command: " + command);
		for (i = 0; i < commands.length; ++i) {
	      if (commands[i].command == req.params.command) {
				const { exec } = require('child_process');
     		   	exec("/root/shell/push/hostexec.js " + hostname + " '" + command + "'", (err, stdout, stderr) => {
				if (stdout == "\n"){
					res.write("#");
				}
				else{
					res.write(stdout);
				}
				res.end();
			    });
			return;
		   }
		}
		console.log("ERROR: TENTATIVA DE EXECUCAO DE COMANDO: ["+req.params.command + "]\n COMMANDS["+i+"] = "+commands );
		res.end();
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
	console.log('--> \n  #########################\n  # New user: ' + socket.username + ' ' )
	console.log("  # Conn.ID: " + socket.client.conn.id + "(" + socket.client.conn.remoteAddress + ") \n  ########################\n" )

	//default username
	//socket.username = "Chatops"
	socket.hostname = "toca das baratas";
	

    //listen on change_username
    socket.on('username', (data) => {
		socket.username = data.username
		console.log(' ## New USER (' + socket.username +") CONNECTED on Websocket channel: username" )
		username = data.username;
		//if (!logged_users.includes(username))
			logged_users.push(username);	
		
		//console.log("chamando a socket.on('username');");	
		//console.log(logged_users);
		io.sockets.emit('newlogin', { message : data.message})
    })
 
	socket.on("disconnect", (reason) => {
		console.log("  ####################");
		console.log("  # Closing Websocket | Reason: "+reason);
		console.log("  # USER (" +socket.username +") ");
		console.log("  # Conn.ID: " + socket.client.conn.id + "(" + socket.client.conn.remoteAddress + ")" )
		console.log("<-- Socket Disconnect  ");

		
		
		console.log("### POP: "+ socket.username);
		if (socket.username != undefined ){
			// logged_users = logged_users.filter(item => item !== socket.username)

			//remove somente a primeira ocorrencia do usuário que fechou a tela de login, se houver outras, que permacecam no array.
			const idx = logged_users.indexOf(socket.username);
			logged_users.splice(idx, idx !== -1 ? 1 : 0);
		
			//manda chamar a newlogin que atualizara todos que ainda estão lá.
			io.sockets.emit('newlogin', { username : socket.username})
		}
		// var clients_in_the_room = io.sockets.adapter.rooms['contactTo'];
		// for (var clientId in clients_in_the_room ) {
		//   console.log('client: %s', clientId); // Seeing is believing
		//   var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this
		// }

		// io.sockets().forEach(function(s) {
		// // 	// ...
		// // 	// for example, s.emit('event', { ... });
		//  	console.log("### SOCKET: s ### ");
		//  	console.log(s);

		//  });
		
		io.sockets.emit('newlogin', { username : socket.username})
	});

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
		nodes.push({ hostname: hostname, version: data.message, hostconfig: data.hostconfig});
    })


    //quando chegar [message], verifica se é igual a uma dessas data.message e responde no [message]
    socket.on('message', (data) => {

		messagesTotal.inc({
			add_user_message: data.username
	  	}) 
	  	hostname = data.hostname
	  	if (data.time!=undefined && data.time !="")
	  		time = data.time;
	  	else
	  		time = new Date();

      //broadcast the new message
      io.sockets.emit('message', {message: data.message, username: socket.username, time:time});

	  chat_add_message({message:data.message, username:socket.username, time:time });

	  //dependendo do texto enviado na mensagem, responder com determinadas ações:
		if (data.message == "getnodes"){
			const { exec } = require('child_process');
			exec('cd /root/shell ; /root/shell/linux/Getnodes.sh ', (err, stdout, stderr) => {
        		stdout = convert.toHtml(stdout)
		    	socket.emit('message', { message : "getnodes: <hr>[ " + stdout + "]", username : "Bot@" + hostname, time:time });
			})

		}
	  	if (data.message == "help"){
   			io.sockets.emit('message', {message : "Olá boa tarde, "+
                                             "tente umas das opções<br> "+
                                             "* deploy -> inicia um novo deploy <br>"+
                                             "* version -> exibe a versao do servidor <br>"+
                                             "* date -> executa o comando data ", username : "Bot@" + hostname, time:time});
		}
        if (data.message == "ntp"){
			  io.sockets.emit('command', {message : "ntp ntp.cais.rnp.br", username : socket.username, time:time});
      	}
		if (data.message == "version"){
		    const { exec } = require('child_process');
     	    exec('cd /root/shell ; /root/shell/linux/cdshell -V', (err, stdout, stderr) => {
               socket.emit('message', { message : "Versão CDSHELL do servidor: [ " + stdout + "]", username: "Bot", time:time  });
	        });
		}	
		
		
    })

	socket.on('contactTo', (data) => {
        io.sockets.emit('contactTo', data);
		if ((data.from != undefined) && (data.toContact != undefined) ){
			addMessageContactToPerson(data.from, data.toContact, data.message, data.time);
			writePrivadoHistoryJson2Fs()
		}
    })

    socket.on('beos', (data) => {
        io.sockets.emit('beos', {message : data.message, username : socket.username, time:data.time});
    })

	socket.on('command', (data) => {
		console.log("channel command: "+data.message);
		const { exec } = require('child_process');
     	    exec(data.message, (err, stdout, stderr) => {
               io.sockets.emit('message', { message: "Saida do comando: [ " + stdout + "]", username: "Bot", time:new Date() });
	        })
    })

	socket.on('sair', (data) => {
        socket.emit('sair', {message : data.message, username : socket.username, time: data.time});
    })

	socket.on('version', (data) => {
		   if (data.message == "hostversion")
         		socket.emit('message', { message : data.message, username: socket.username, time: data.time });
		   
		   if (data.message == "CDSHELL"){
			   const { exec } = require('child_process');
     		 	exec('cd /root/shell ; /root/shell/linux/cdshell -g', (err, stdout, stderr) => {
        	   socket.emit('message', { message : stdout, username:"Bot", time: data.time });
	       });
		   }
		   if (data.message == "sistemas"){
			 //io.sockets.emit('command', {message : "ntpdate ntp.cais.rnp.br", username : socket.username});
			   const { exec } = require('child_process')
     		 exec('cd /root/sistemas ; /root/shell/linux/cdshell -g', (err, stdout, stderr) => {
        		socket.emit('message', { message : stdout });
	       });
		   }

    })


    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', data)
    })

 	socket.on('hostexec', (data) => {
        //broadcast the new message
        io.sockets.emit('hostexec', {hostname : data.hostname, command: data.command});
    })

	socket.on('distribute_log', (data) => {
        //broadcast the new message
        io.sockets.emit('log.'+data.hostname, {saida:data.saida});
		console.log(data);
    })
	socket.on("newlogin",(username) => {
		io.sockets.emit('newlogin', username);
		//console.log(data);

	})
	socket.on("audio",(media) => {
		io.sockets.emit('audio', media);
		console.log(media);
	})
})


//promtheus with socket.io metrics 
//prometheus.metrics(io);
const ioMetrics = prometheus.metrics(io, {
	collectDefaultMetrics: true,
	checkForNewNamespaces: false
})
//const metrics = ioMetrics.register.metrics();


  // Faz uma chamada na inicialização da  sistemas/servidorPush/ <- ./version para anunciar a versão pro Getnodes.sh
  const { exec } = require('child_process');
  exec("cd /root/shell/push ; ./version.js ", (err, stdout, stderr) => {});
