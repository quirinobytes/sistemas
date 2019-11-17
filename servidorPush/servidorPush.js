#!/usr/bin/env node

var fs = require('fs');
var commands_json = '/root/sistemas/servidorPush/comandos.json';
var commandsJsonFile = fs.readFileSync(commands_json);
var commands = JSON.parse(commandsJsonFile);
//var commands = [{ command: "ping 8.8.8.8 -c1"},{command: "/root/shell/push/deploy.js deploy"},{command:"/root/shell/push/command.js 'wall rafael'"},{command:"hostname"}];

// Formidable para upload de arquivos
var formidable = require('formidable');

// Leyout do ejs
var expressLayouts = require('express-ejs-layouts')

const express = require('express')
const app = express()
var history="";
var nodes=[];

//var json = '{"messages":[{"Id":01,"username":"Rafael","text":"Mustang"},{"Id":02,"username":"Bia","text":"Oi Rafael, vc está bem?"},{"Id":03,"username":"Tali","text":"Oi Rafiusks... eai conseguiu terminar, meu vc ficou ate tarde"}]}';
//var chatMessages = [{id:01,"username":"Rafael","text":"Mustang"},{id:02,"username":"Bia","text":"Oi Rafael, vc está bem?"},{id:03,"username":"Tali","text":"Oi Rafiusks... eai conseguiu terminar, meu vc ficou ate tarde"}];
var chatMessages = [];
var chatMessageId = 0;
var projetos = [{id:01,"name":"shell","apelido":"CDSHELL","desc":"Esse projeto é sobre o CDSHELL","farms":"cdshell_FARM","equipe":"BackEnd-Nodejs"},{id:02,"name":"workspace","apelido":"My Workspace","desc":"Esse projeto contém todo meu Wrokspace Atual","farms":"workspace_FARM","equipe":"BackEnd-Nodejs,FrontEnd-Angular,ArtificalInteligence"}];
var farms = [{id:01,"name":"cdshell_FARM","apelido":"CDSHELL FARM","desc":"Esse projeto é sobre o CDSHELL","nodes":["dev1","dev2"]},{id:02,"name":"workspace_FARM","apelido":"WK FARM","desc":"Esse projeto é sobre o WORKSPACE","nodes":["dev3","dev4"]}];
var roles = [{id:01,"name":"frontend","apelido":"Servidores Front-End","icon":"https://visualpharm.com/assets/896/Cisco%20Router-595b40b75ba036ed117d8b7b.svg"},{id:02,"name":"backend","apelido":"Servidores Back-End","icon":"https://visualpharm.com/assets/419/Hub-595b40b75ba036ed117d8d05.svg"},{id:03,"name":"Nas","apelido":"Servidores NAS","icon":"https://visualpharm.com/assets/761/Nas-595b40b75ba036ed117d8dcd.svg"}];



//Listen on port 3000
server = app.listen(3000)
//socket.io instantiation
const io = require("socket.io")(server)


//set the template engine ejs
app.set('view engine', 'ejs')

//usando o layout do EJS
app.use(expressLayouts)

//middlewares
app.use(express.static('public'))

 
//routes
app.get('/', (req, res) => {
	res.render('index')
})

app.get('/upload', (req, res) => {

	path = "./fileupload/";
	//abre o diretorio path e renderiza para o ejs renderizar o arquivo upload.ejc com a var items
	fs.readdir(path, (err, files) => res.render('upload', { items: files }  ));
})

app.post('/fileupload', (req, res) => {
var form = new formidable.IncomingForm();

 form.parse(req, function (err, fields, files) {
	var oldpath = files.filetoupload.path;
	var newpath = './fileupload/' + files.filetoupload.name;
	fs.rename(oldpath, newpath, function (err) {

 	if (err) throw err;
		//res.write('File uploaded and moved!');
		res.redirect('./upload')
    	res.end();
 	});
 });
})

app.post('/repo/:name', (req, res) => {
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


app.get('/deletefile/:filename', (req,res) => {

		const filename = req.params.filename
		const path = "./fileupload/"
		
		try {
			fs.unlinkSync(path+filename)
			console.log("Arquivo apagado="+filename)
		} catch(err) {
			console.error(err)
		}
	console.log("Arquivo apagado "+req.params.filename)
	res.redirect('./../upload')
})

app.get ('/rest/projetos/list/',function (req,res) {
		res.json(projetos);
        res.end();
});

app.get ('/contact',function (req,res) {
	res.render('contact')
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
	var socketclient = ioclient.connect('http://servidorpush.superati.com.br:3000')
	fileupload
	var ativo = req.params.ativo;
		html="Mensagem: " + ativo ;
		history = history + ativo;
        //res.writeHeader(200, {"Content-Type": "text/html"});
        res.writeHeader(200, {"Content-Type": "application/text"});
        res.write(html);
        res.end();
		socketclient.emit('message', {message : ativo , username : socketclient.username});
});

app.get ('/rest/chat/list/',function (req,res) {
//        res.writeHeader(200, {"Content-Type": "text/json"});
//        res.write(chatMessages.text);
		res.json(chatMessages);
        res.end();
});

app.get ('/rest/chat/add/:username/:messageText',function (req,res) {
		messageText = req.params.messageText;
		username = req.params.username;
		newMessage = {id:chatMessageId,username:username,text:messageText};
		chatMessageId++;
		chatMessages.push(newMessage);
        res.json(chatMessages);
        res.end();
});
app.get ('/rest/chat/del/:messageId',function (req,res) {

		var chatMessages_filter = [];

		for (i = 0; i < chatMessages.length; ++i) {
	      if (chatMessages[i].id == req.params.messageId) {
			console.log("DELETED CHAT MESSAGE[ " +i+ " ] = " + chatMessages[i].text + "");
		   }
		   else
			   {
				   chatMessages_filter.push(chatMessages[i]);
			   }
		}
		chatMessages = chatMessages_filter;
		res.json(chatMessages);
		res.end();
});


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
});

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
});

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
});


app.get ('/rest/commands/',function (req,res) {
					console.log("Commandos: " + commands);
        			res.json(commands);
					res.end();
					return;
});

app.get ('/rest/commands/set/:id/:command',function (req,res) {

		var command = req.params.command;
		var id = req.params.id;

		console.log("Command: " + command);
	      commands[id].command = req.params.command ;
			console.log("SET COMMANDS[ " +id + " ] = " + req.params.command + "");


		res.json({});
		res.end();
});

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
});


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
});



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
});

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
});




//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')
	console.log("Conn.ID: " + socket.client.conn.id + "(" + socket.client.conn.remoteAddress + ")" )

	//default username
	socket.username = "Server"
	socket.hostname = "";

    //listen on change_username
    socket.on('username', (data) => {
        socket.username = data.username
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
		nodes.push({ hostname: hostname, version: data.message, hostconfig: data.hostconfig});
    })


    //listen on new_message
    socket.on('message', (data) => {
        //broadcast the new message
        io.sockets.emit('message', {message : data.message, username : socket.username});
		if (data.message == "devops"){
			io.sockets.emit('message', {message : "devops" , username : socket.username});
		}
		if (data.message == "ntp"){
			io.sockets.emit('command', {message : "ntpdate ntp.cais.rnp.br", username : socket.username});
		}
		if (data.message == "ntp2014"){
			io.sockets.emit('command', {message : "ntp2014", username : socket.username});
		}
		if (data.message == "version"){
			const { exec } = require('child_process');
     		   	exec('cd /root/shell ; /root/shell/linux/cdshell -g | cut -f2 -d: ', (err, stdout, stderr) => {
        		socket.emit('message', { message : stdout });
	        });
		}

    })

    socket.on('beos', (data) => {
        //broadcast the new message
        io.sockets.emit('beos', {message : data.message, username : socket.username});
    })

	socket.on('command', (data) => {
        //broadcast the new message
        io.sockets.emit('distributed', {message : data.message, username : socket.username});
		console.log('DISTRIBUTING [ '+ data.message + ' ] on nodes...')
    })

	socket.on('sair', (data) => {
        //broadcast the new message
        socket.emit('sair', {message : data.message, username : socket.username});
    })

	socket.on('version', (data) => {
		if (data.message == "hostversion"){
        		socket.emit('message', { message : data.message });
				console.log("VERSION VAZIA ENVIADA" + data.message);
		}
		if (data.message == "CDSHELL"){
			//io.sockets.emit('command', {message : "ntpdate ntp.cais.rnp.br", username : socket.username});
			const { exec } = require('child_process');
     		   	exec('cd /root/shell ; /root/shell/linux/cdshell -g', (err, stdout, stderr) => {
        		socket.emit('message', { message : stdout });
	        });
		}
		if (data.message == "sistemas"){
			//io.sockets.emit('command', {message : "ntpdate ntp.cais.rnp.br", username : socket.username});
			const { exec } = require('child_process');
     		   	exec('cd /root/sistemas ; /root/shell/linux/cdshell -g', (err, stdout, stderr) => {
        		socket.emit('message', { message : stdout });
	        });
		}

    })


    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
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
})

  const { exec } = require('child_process');
  exec("cd /root/shell/push ; ./version.js ", (err, stdout, stderr) => {});
