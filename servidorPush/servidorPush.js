#!/usr/bin/env node

const express = require('express')
const app = express()


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)
//socket.io instantiation
const io = require("socket.io")(server)


app.get ('/rest/message/:ativo',function (req,res) {
	const ioclient = require("socket.io-client")
	var socketclient = ioclient.connect('http://servidorpush.superati.com.br:3000')

	var ativo = req.params.ativo;
		html="rafael: " + ativo ;
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
		socketclient.emit('message', {message : ativo , username : socketclient.username});
});



//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')
	console.log("Conn.ID: " + socket.client.conn.id + "(" + socket.client.conn.remoteAddress + ")" )

	//default username
	socket.username = "Server"

    //listen on change_username
    socket.on('username', (data) => {
        socket.username = data.username
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
		if (data.message == "tt"){
			io.sockets.emit('command', {message : "tt", username : socket.username});
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


    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
