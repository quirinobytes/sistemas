#!/usr/bin/env node
var crawlerjs = require('crawler-js');
var request = require('request');
var fs = require('fs');
var fields = ['valor_VALE5','valorizacao_VALE5','percentual_VALE5'];
var url_LOADPRICE = 'http://bolsa.superati.com.br/loadprice' ;
var data;

crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/equities/vale-pna-n1',
	get: 'http://www.investing.com/equities/vale-pna-n1',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
							data = {};
							data.valor_VALE5 = html.children('span').eq(0).text();
							data.valorizacao_VALE5 = html.children('span').eq(1).text();
							data.percentual_VALE5 = html.children('span').eq(3).text();
				            gravarCSV(data);
							}
					}
				]

}



function loadPrice(){
	var options = { method: 'POST',
     				url: url_LOADPRICE,
				    headers: {  'postman-token': '0c17b7e5-ee61-6514-60af-a7384edb97dc',
								'cache-control': 'no-cache',
								'content-type': 'application/x-www-form-urlencoded' },
					form:  { ativo: 'VALE5',  valor: data.valor_VALE5,  token: '1234abcd' }
	};
    //fazendo o request(POST) para atualizar o preço na mesa de operacoes.
    req = request(options, function (error, response, body) {
        if(error) throw new Error(error)
	});
}

function gravarCSV (data) {
      if (data.valor_VALE5 && data.valorizacao_VALE5 && data.percentual_VALE5) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_VALE5 + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_VALE5 + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_VALE5 + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/vale5.csv', csv, function(err){ if (err) throw err; });
          loadPrice();
		  console.log("VALE5= "+data.valor_VALE5);
      }
}

crawlerjs(crawler);
