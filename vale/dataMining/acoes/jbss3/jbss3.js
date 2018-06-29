#!/usr/bin/env node
var crawlerjs = require('crawler-js');
var request = require('request');
var fs = require('fs');
var fields = ['valor_JBSS3','valorizacao_JBSS3','percentual_JBSS3'];
var url_LOADPRICE = 'http://localhost:3000/loadprice' ;
var data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/equities/jbs-on-nm',
	get: 'http://www.investing.com/equities/jbs-on-nm',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
									data = {};
									data.valor_JBSS3 = html.children('span').eq(0).text();
									data.valorizacao_JBSS3 = html.children('span').eq(1).text();
									data.percentual_JBSS3 = html.children('span').eq(3).text();
									gravarCSV(data);
									}
					}
				]
}




function loadPrice(){
	var options = { method: 'POST',
				url: url_LOADPRICE,
			    headers:  { 'postman-token': '0c17b7e5-ee61-6514-60af-a7384edb97dc',
							'cache-control': 'no-cache',
							'content-type': 'application/x-www-form-urlencoded' },
				form: { ativo: 'jbss3', valor: data.valor_jbss3, token: '1234abcd' }
    };
	//fazendo o request(POST) para atualizar o preço.
	req = request(options, function (error, response, body) {
    	if(error) throw new Error(error)
	});
}

function gravarCSV (data) {
      if (data.valor_JBSS3 && data.valorizacao_JBSS3 && data.percentual_JBSS3) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_JBSS3 + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_JBSS3 + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_JBSS3 + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/jbss3.csv', csv, function(err){ if (err) throw err; });
          loadPrice();
      }
}

crawlerjs(crawler);
