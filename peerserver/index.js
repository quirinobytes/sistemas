const express = require("express");
const { ExpressPeerServer } = require("peer");
var expressLayouts = require('express-ejs-layouts')
var cors = require('cors')



const app = express();

app.get("/", (req, res, next) => {


  res.setHeader("Access-Control-Allow-Origin", "*");

  res.send("Hello world!");
})


app.use(cors())
app.use(express.static('public'))

//app.use(express.static('public/css'))



// =======

//const server = app.listen(9000);

//const peerServer = ExpressPeerServer(server, {
//	path: "/myapp",
//});

//app.use("/peerjs", peerServer);

// == OR ==

const http = require("http");

//const server = http.createServer(app);



// server.listen(9000);

// ========


var   fs = require("fs"),
      https = require("https");

var privateKey = fs.readFileSync('sslcert/server.key').toString();
var certificate = fs.readFileSync('sslcert/server.crt').toString();

var credentials = {key: privateKey, cert: certificate};

var server = https.createServer(credentials,app);





var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

const peerServer = ExpressPeerServer(httpsServer, {
	debug: true,
  port: 30443,
	path: "/myapp",
});

app.use("/peerjs", peerServer);

app.get("/id", (req, res) => {

  
})


// Adicionar os cabeçalhos Access-Control-Allow-Origin



httpServer.listen(1000);
httpsServer.listen(1443);

