var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');

fields = ['valor_BRASIL_GROWTH','anterior_BRASIL_GROWTH','maximo_BRASIL_GROWTH','minimo_BRASIL_GROWTH'];


crawler = {
	interval: 100,
	getSample: 'http://pt.tradingeconomics.com/brazil/government-bond-yield',
	get: 'http://pt.tradingeconomics.com/brazil/government-bond-yield',
  preview: 3,
	extractors: [
		{
		selector: '#ctl00_ContentPlaceHolder1_ctl02_PanelDefinition div table',
		callback: function (err,html,url,response) {
			data = {};
//			data.titulo = "Custo de capital de emissões nacionais nos mercados globais";
			data.valor_BRASIL_GROWTH = html.children('tr').eq(0).children('td').eq(1).text();
			data.anterior_BRASIL_GROWTH = html.children('tr').eq(0).children('td').eq(2).text();
			data.maximo_BRASIL_GROWTH = html.children('tr').eq(0).children('td').eq(3).text();
			data.minimo_BRASIL_GROWTH = html.children('tr').eq(0).children('td').eq(4).text();
			data.url = url;
			console.log(data);
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('../../../csv/all/brasil-growth.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});
			}
		}
	]

}

crawlerjs(crawler);

