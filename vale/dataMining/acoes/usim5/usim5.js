var crawlerjs = require('crawler-js');
var request = require('request');
var fs = require('fs');
var fields = ['valor_USIM5','valorizacao_USIM5','percentual_USIM5'];
var url_LOADPRICE = 'http://localhost:3000/loadprice' ;
var	data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/equities/usiminas-pna',
	get: 'http://www.investing.com/equities/usiminas-pna',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_USIM5 = html.children('span').eq(0).text();
								data.valorizacao_USIM5 = html.children('span').eq(1).text();
								data.percentual_USIM5 = html.children('span').eq(3).text();
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
					form: { ativo: 'USIM5', valor: data.valor_USIM5, token: '1234abcd' }
    };
	//fazendo o request(POST) para atualizar o preço.
	req = request(options, function (error, response, body) {
    	if(error) throw new Error(error)
	});
}

function gravarCSV (data) {
      if (data.valor_USIM5 && data.valorizacao_USIM5 && data.percentual_USIM5) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_USIM5 + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_USIM5 + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_USIM5 + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/usim5.csv', csv, function(err){ if (err) throw err; });
          loadPrice();
      }
};


crawlerjs(crawler);
