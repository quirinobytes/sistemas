#!/usr/bin/env node

	var os = require("os")
	const io = require("socket.io-client");
	var socket = io.connect('http://servidorpush.superati.com.br:3000')

	//buttons and inputs
	var message = "version:" + process.argv[2]
	var host = os.hostname();

	//Emit a deploy 
//		socket.emit('beos', {username : host }) 

	//Emit message
		socket.emit('beos', {message : message })
		socket.emit('sair', {message : "sair" })
		
		socket.on("sair", (data) => {
        console.log("Saindo: " + data.username + ": " + data.message )
	    socket.disconnect();
     })


