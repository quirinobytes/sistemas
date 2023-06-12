//##################
//### peerserver ###
//##################

console.log("#########################")
console.log("#  Evolua - Peerserver  #")
console.log("#########################\n\n")

console.log("[INFO] Peerserver \t\t-> STARTING ")

const { ExpressPeerServer } = require("peer")
const express = require("express")
var expressLayouts = require('express-ejs-layouts')
var cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('public'))



const http = require("http")
const https = require("https")
var fs = require("fs")
var privateKey = fs.readFileSync('sslcert/server.key').toString()
var certificate = fs.readFileSync('sslcert/server.crt').toString()
var credentials = {key: privateKey, cert: certificate}



var server = https.createServer(credentials,app)
var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

console.log("[INFO] Listen on HTTP/HTTPS \t-> DONE")


const peerServer = ExpressPeerServer(httpsServer, {
	debug: true,
  port: 30443,
	path: "/myapp", 
});


app.get("/chamandoconf/:from/:to", (req,res) => {
  from = req.params.from
  to = req.params.to
  timestamp = new Date(data.time).toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
  console.log("[ ✆ ] "+timestamp+ " ⏯ @"+from+" iniciando webcall com @"+to)
})

app.use("/peerjs", peerServer)

app.get("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.send("Hello, peerservice is running OK!")
})

httpServer.listen(1000)
httpsServer.listen(1443)
console.log("[INFO] Peerserver \t\t-> STARTED")
