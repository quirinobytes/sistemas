#!/usr/bin/env node

var fs = require('fs');
var commands_json = '/root/sistemas/servidorPush/comandos.json';
var commandsJsonFile = fs.readFileSync(commands_json);
var commands = JSON.parse(commandsJsonFile);
//var commands = [{ command: "ping 8.8.8.8 -c1"},{command: "/root/shell/push/deploy.js deploy"},{command:"/root/shell/push/command.js 'wall rafael'"},{command:"hostname"}];


const express = require('express')
const app = express()
var history="";
var nodes=[];

//var json = '{"messages":[{"Id":01,"username":"Rafael","text":"Mustang"},{"Id":02,"username":"Bia","text":"Oi Rafael, vc está bem?"},{"Id":03,"username":"Tali","text":"Oi Rafiusks... eai conseguiu terminar, meu vc ficou ate tarde"}]}';
//var chatMessages = [{id:01,"username":"Rafael","text":"Mustang"},{id:02,"username":"Bia","text":"Oi Rafael, vc está bem?"},{id:03,"username":"Tali","text":"Oi Rafiusks... eai conseguiu terminar, meu vc ficou ate tarde"}];
var chatMessages = [];
var chatMessageId = 0;



//Listen on port 3000
server = app.listen(3000)
//socket.io instantiation
const io = require("socket.io")(server)


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

app.get ('/rest/message/:ativo',function (req,res) {
	const ioclient = require("socket.io-client")
	var socketclient = ioclient.connect('http://servidorpush.superati.com.br:3000')

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
        		res.write(stdout);
				res.end();
			    });
			return;
		   }
		}
		console.log("ERROR: TENTATIVA DE EXECUCAO DE COMANDO: ["+req.params.command + "]\n COMMANDS["+i+"] = "+commands );
		res.json({});
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
        socket.hostversion = data.message;
		hostname = data.hostname;
		socket.emit('message', { message : data.message});
		var i;
		for (i = 0; i < nodes.length; ++i) {
	      if (nodes[i].hostname == hostname) {
			        nodes[i].version = data.message;
		   			return ;
		   }
		}
		//nodes.push({ hostname: hostname, version: data.message});
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
