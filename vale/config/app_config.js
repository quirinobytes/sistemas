var express = require('express');
var bodyParser = require('body-parser');
var port = 2020;
var ip = '192.168.200.1';

var app = module.exports = express();

app.listen(port,ip);

//Configurar o uso do body-parser para receber URL encoded
app.use(bodyParser.urlencoded({extended:true}));

//Configurar o bodyparser para receber Json tmb.
app.use(bodyParser.json());

// Configurar outras aplicações que possam usar a API.
app.use (function (req,res,next){
// Permitindo acesso a todo mundo * / definir do cliente IP.
res.setHeader ('Access-Control-Allow-Origin', '*');
// Definir os metodos HTTP que poderão ser aceitos.
res.setHeader ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
 // Definir os cabeçalhos que serão aceitos.
res.setHeader ('Access-Control-Allow-Headers', 'X-Requested-With', 'content-type','Authorization');
next();
})

