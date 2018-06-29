var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_COAL','maximo_COAL','minimo_COAL'];
var data;



crawler = {
	interval: 100,
	getSample: 'http://www.infomine.com/investment/metal-prices/coal/1-year/',
	get: 'http://www.infomine.com/investment/metal-prices/coal/1-year/',
	preview: 0,
	extractors: [
					{
					selector: '#litTickerHeaderText',
					callback: function (err,html,url,response) {
						data = {};
						str = html.text();
						str2 = str.split("USD");

						valor = str2[0].split("Price");
						low = str2[2].split("Low");
						high = str2[3].split("High");

						data.valor_COAL = valor[1];
						data.maximo_COAL= high[1];
						data.minimo_COAL = low[1];
						gravarCSV(data);
						}
					}
				]
}

function gravarCSV (data) {
      if (data.valor_COAL && data.maximo_COAL && data.minimo_COAL) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_COAL + '"';
          csv+= ',';
          csv+= '"'+ data.maximo_COAL + '"';
          csv+= ',';
          csv+= '"'+ data.minimo_COAL + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/coal.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
