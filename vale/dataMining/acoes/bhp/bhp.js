var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');

fields = ['valor_BHP','valorizacao_BHP','percentual_BHP'];



crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/equities/bhp-billiton-limited?cid=23647',
	get: 'http://www.investing.com/equities/bhp-billiton-limited?cid=23647',
  preview: 3,
	extractors: [
		{
		selector: 'div div div div div .top',
		callback: function (err,html,url,response) {
			data = {};
			data.valor_BHP = html.children('span').eq(0).text();
			data.valorizacao_BHP = html.children('span').eq(1).text();
			data.percentual_BHP = html.children('span').eq(3).text();
			data.url = url;
			console.log(data);
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('/root/workspace/bolsa-systems/blueMoney/csv/all/bhp.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});

			}
		}
	]

}

crawlerjs(crawler);

