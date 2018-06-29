var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_IRON_ORE_PELLETS','maximo_IRON_ORE_PELLETS','minimo_IRON_ORE_PELLETS'];
var data;



crawler = {
	interval: 100,
	getSample: 'http://www.infomine.com/investment/metal-prices/iron-ore-pellets/1-year/',
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
								low = str2[1].split("Low");
								high = str2[2].split("High");

								data.valor_IRON_ORE_PELLETS  = valor[1];
								data.maximo_IRON_ORE_PELLETS = high[1];
								data.minimo_IRON_ORE_PELLETS = low[1];
								gravarCSV(data);
								}
					}
				]
}

function gravarCSV (data) {
      if (data.valor_IRON_ORE_PELLETS && data.valorizacao_IRON_ORE_PELLETS && data.percentual_IRON_ORE_PELLETS) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_IRON_ORE_PELLETS + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_IRON_ORE_PELLETS + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_IRON_ORE_PELLETS + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/iron-ore-pellets.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
