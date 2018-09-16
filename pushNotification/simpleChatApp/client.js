#!/usr/bin/env node

	var os = require("os")
	const io = require("socket.io-client")
	var socket = io.connect('http://192.168.15.15:3000')

	//buttons and inputs
	var message = "version:" + process.argv[2]
	var host = os.hostname();

	//Emit a username
		socket.emit('username', {username : host }) 

	//Emit message
		socket.emit('message', {message : message })
		socket.emit('sair', {message : "sair" })
		
		socket.on("sair", (data) => {
        console.log("Saindo: " + data.username + ": " + data.message )
	    socket.disconnect()
     })


