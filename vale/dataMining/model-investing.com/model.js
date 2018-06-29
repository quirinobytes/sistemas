var crawlerjs = require('crawler-js');
var fs = require('fs');
fields = ['valor','valorizacao','percentual'];


crawler = {
	interval: 100,
	getSample: '',
	get: '',
  preview: 3,
	extractors: [
		{
		selector: 'div div div div div .top',
		callback: function (err,html,url,response) {
			data = {};
			data.valor = html.children('span').eq(0).text();
			data.valorizacao = html.children('span').eq(1).text();
			data.percentual = html.children('span').eq(3).text();
			data.url = url;
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('../../../csv/all/anglo-american.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});

			console.log(data);
			}
		}
	]

}

crawlerjs(crawler);

