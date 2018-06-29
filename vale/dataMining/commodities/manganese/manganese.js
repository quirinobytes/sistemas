var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_MANGANESE','maximo_MANGANESE','minimo_MANGANESE'];
var data;



crawler = {
	interval: 100,
	getSample: 'http://www.infomine.com/investment/metal-prices/manganese/',
	get: 'http://www.infomine.com/investment/metal-prices/manganese/',
    preview: 0,
	extractors: [
					{
					selector: '#litTickerHeaderText',
					callback: function (err,html,url,response) {
								data = {};
								str = html.text();
								str2 = str.split("USD");

								valor = str2[0].split("Price");
								low = str2[1].split("Low");
								high = str2[2].split("High");

								data.valor_MANGANESE = valor[1];
								data.maximo_MANGANESE= high[1];
								data.minimo_MANGANESE = low[1];
								gravarCSV(data);
								}
					}
				]
}
function gravarCSV (data) {
      if (data.valor_MANGANESE && data.valorizacao_MANGANESE && data.percentual_MANGANESE) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_MANGANESE + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_MANGANESE + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_MANGANESE + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/manganese.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);

