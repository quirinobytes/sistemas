#!/usr/bin/env node
var request = require('request');
var Chance = require('chance');
var chance = new Chance();
var fs = require('fs');
content= {};

// ### CONFIG ###
var debug=false;
var REQUESTS=500;
var filename = '/root/workspace/bolsa-systems/blueMoney/backEnd/robos/comprador/datafiles/cotacoes-c.json';
var urlserver = 'http://superati.com.br:3000/comprar' ;

//fs.exists(filename, function(exists) {
// if (exists) {
	var conteudojson = fs.readFileSync(filename);
	var content = JSON.parse(conteudojson);
// }
//});
var totalUrl = 1;
array_valores=[];

array_ativos = ['VALE5','CSNA3','PETR4','USIM5','GOLL4','GGBR4','GOAU4'];


if (content.VALE5)	array_valores['VALE5'] = content.VALE5 ;
else array_valores['VALE5'] = 21.90;

if (content.USIM5) 	array_valores['USIM5'] = content.USIM5 ;
else array_valores['USIM5'] = 4.60;

if (content.PETR4) array_valores['PETR4'] = content.PETR4 ;
else 	array_valores['PETR4'] = 18;

if (content.GOLL4) 	array_valores['GOLL4'] = content.GOLL4;
else 	array_valores['GOLL4'] = 8;

if (content.GGBR4)	array_valores['GGBR4'] = content.GGBR4 ;
else	array_valores['GGBR4'] = 11;

if (content.GOAU4)	array_valores['GOAU4'] = content.GOAU4 ;
else	array_valores['GOAU4'] = 4;

if (content.CSNA3)	array_valores['CSNA3'] = content.CSNA3 ;
else	array_valores['CSNA3'] = 10;




// -d para executar no modo daemon
if (process.argv[2] == '-d')
//	while (true) 
	for (c=0;c<REQUESTS;c++){

		getUrl();
		stop = new Date().getTime();
    	while(new Date().getTime() < stop + 1) {
		}
}
else
	getUrl();

gravar_cotacoes_no_arquivo(array_valores);
//FIM


function getUrl(){
    papel =  array_ativos[chance.integer({min: 0, max: 6})];
    //se passar o PRIMEIRO paramentro na linha de entrada +1 +2 ou +3 ele aumenta a força
    if (process.argv[2] == '+1') 
	   qtde = chance.integer({min: 1, max: 40})*100;
    if (process.argv[2] == '+2') 
	   qtde = chance.integer({min: 1, max: 50})*100;
    if (process.argv[2] == '+3') 
	   qtde = chance.integer({min: 1, max: 100})*100;
    else
    qtde = chance.integer({min: 1, max: 20})*100;
    preco = chance.floating({min: 75, max: 125}) * array_valores[papel] /100;

    var options = { method: 'POST',
	 url: urlserver, 
	 headers:
	  { 'postman-token': '0c17b7e5-ee61-6514-60af-a7384edb97dc',
		'cache-control': 'no-cache',
		'content-type': 'application/x-www-form-urlencoded' },
	 form:
	  { id_corretora: '13',
		id_cliente: '27',
		ativo: papel,
		quantidade: qtde,
		valor: preco,
		token: '1234abcd'
	  }
    };

	if (debug) console.log();
	req = request(options, function (error, response, body) {
		if(error) throw new Error(error)

		if (debug) console.log(body);
			obj = JSON.parse(body)
		if (obj.Compra){
			 if (debug) console.log (obj.ativo);
			 array_valores[obj.ativo] = obj.valor;
			 array_valores[papel] = obj.valor;
		}
		else{
			 array_valores[papel] = obj.valor;
		}

		gravar_cotacoes_no_arquivo(array_valores);

	if (debug)   mostrar(array_valores); //EXIBIR AS COTACOES LOGO APOS FAZER O REQUEST.
    //  response.end;
	});


	
  //mostrar(array_valores);
};

function gravar_cotacoes_no_arquivo(r){
// EXEMPLO DE JSON ->
// { "name": "John Johnson", "street": "Oslo West 16", "phone": "555 1234567" };

data = { "VALE5": r['VALE5'], "CSNA3": r['CSNA3'], "PETR4": r['PETR4'], "GOLL4": r['GOLL4'], "GOAU4":r['GOAU4'], "GGBR4" :r['GGBR4'], "USIM5" :r['USIM5'] };

//leva de JSON para stringify
var jsonstring = JSON.stringify(data);

//leva de stringify para JSON
var jsonobject = JSON.parse(jsonstring);

//console.log("STRINGFY"+jsonstring );
fs.writeFileSync(filename, jsonstring);
};

function mostrar(array) {
  //limpar a tela
  //  console.log ("\033[2J");
  //voltar la no começo da tela
  console.log ("\033[0;0f");
  console.log( array );
}
