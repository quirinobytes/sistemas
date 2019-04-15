#!/usr/bin/env node

var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')


var finalhandler = require('finalhandler')
var serveStatic = require('serve-static')
var app = express()

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))


var serve = serveStatic('./site')

app.post('/contactform', function (req, res) {
  const { name, email, subject, message } = req.body

  const json = { username: name, email: email, titulo: subject, mensagem: message }

  const content = JSON.stringify(json) 
  console.log(json)
  const filename = 'messages.json'

  fs.exists(filename, function(exists) {
    saved = fs.appendFileSync(filename, content + ',' , 'utf8', function () {
      
    })
    res.send('OK')
  })
})
  

app.use('/', function(req, res) {
  var done = finalhandler(req, res)
  serve(req, res, done)
})

var server = http.createServer(app)

server.listen(81)
