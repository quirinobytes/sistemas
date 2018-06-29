var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');

fields = ['valor_BRENT','valorizacao_BRENT','percentual_BRENT'];



crawler = {
	interval: 100,
	getSample: 'https://br.investing.com/commodities/brent-oil',
	get: 'https://br.investing.com/commodities/brent-oil',
  preview: 3,
	extractors: [
		{
		selector: 'div div div div div .top',
		callback: function (err,html,url,response) {
			data = {};
			data.valor_BRENT = html.children('span').eq(0).text();
			data.valorizacao_BRENT = html.children('span').eq(1).text();
			data.percentual_BRENT = html.children('span').eq(3).text();
			data.url = url;
			console.log(data);
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('../../../csv/all/brent.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});

			}
		}
	]

}

crawlerjs(crawler);

