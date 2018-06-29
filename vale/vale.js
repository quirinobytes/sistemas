#!/usr/bin/env node
var express = require("express");
var colors = require('colors');
var app = require('./config/app_config');
var db = require('./config/db_config.js');
var product = require('./models/product');
var productController = require('./controllers/productController');
const { spawn } = require('child_process');
var fs = require("fs");
var faturamento=0, total=3;
var path = require('path');

// ### CONFIG ###
var debug=false;
if (process.argv[2] == '-v')
	var cfg_mostrapainel=1;
else
	var cfg_mostrapainel=0;

	var cfg_mostrapainel=1;
//########################################################################################
//								Vale Estacionamento
//########################################################################################
var start = new Date();
cls();

console.log('==================================================='.blue);
console.log("|".blue + "#".yellow +"|".blue + "\t" + "".green +  "Vale".yellow + " ® ".red + " Estacionamento ".white+  " - Versão 1.0".cyan  + "  "+ "|".blue + "#".yellow + "|".blue);
console.log('===================================================\n\n'.blue);
console.log("° Horário de inicio: "+ String(start).grey+"............. ".grey +"OK\n".green);

veiculos = {};

//array para armazenar o valor dos veiculos realtime
veiculos['GXC4180'] = {'placa':'GXC4180' , 'marca':'GM', cor:'branco',  'entrada':1530325997691};
veiculos['HIN2807'] = {'placa':'HIN2807' , 'marca':"FIAT", cor:'preto', 'entrada':1530201700000};
veiculos['ABC2807'] = {'placa':'ABC2807' , 'marca':"FIAT", cor:'preto', 'entrada':1530163007691};

//###############		/ 			###############################
app.get ('/',function (req,res) {

	fs.readFile('./website/index.html', function (err, html) {
    	if (err) {     	throw err;	    }
		res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
	});
});
app.use('/website', express.static(path.join(__dirname, './website')));

//####################### Total de Veiculos na Loja
app.get ('/total',function(req,res){
	res.writeHead(200, {"Content-Type" : "text/html"}); 
	res.write(''+total);
	res.end();
});

//####################### Listar Veiculos
app.get ('/listar',function(req,res){
	res.json(veiculos);
});

//#######################	Estacionar ( JSON({placa:'ABC0123'}) )  
app.post ('/entrar',function(req,res){
    var placa = req.body.placa;
    var cor = req.body.cor;
    var marca = req.body.marca;
	var convenio = req.body.convenio;
	var hora = Date.now(); 
	if (placa != undefined && veiculos[placa] == undefined ){
		total++;
		veiculos[placa] = {'placa':placa, 'marca':marca, 'cor':cor, 'entrada':hora};
		res.json({'Entrada':true,'placa':placa});
		mostra_painel();
	}
	else{ 
		res.json({'Entrada':false,'retorno':'Carro ja esta dentro'});
	}
});

//#######################    		Saida do Estacionamento
app.post ('/sair', function (req,res) {
	var placa = req.body.placa;
    var cor = req.body.cor;
    var marca = req.body.marca;
	var convenio = req.body.convenio;
	var hora = Date.now(); 
	console.log(placa);
	if (placa != undefined ){ total--;
		delete veiculos[placa];
	}
	mostra_painel();
	res.json({'Saida':true,'placa':placa});
});

function mostra_painel(){
	cls();
	str_total = total.toString().green;
	tempo = (new Date() - start)/1000;
	console.log("\t\t###   Mesa de Operações    ###\t tempo:".yellow + tempo.toFixed(0)+ "s Total: "+str_total+"M"); 
	console.log("\t\t      =================       ".yellow); 
	console.log("  PLACA   |   ENTRADA     |    CONVENIO      | ENTRADA |    PREÇO ");
	console.log("==========|=============|===============|===============|=======|=======|==============");
	console.log(veiculos);
};

function cls(){
	//limpar a tela
	console.log ("\033[2J");
	//voltar la no começo da tela
	console.log ("\033[0;0f");
}
