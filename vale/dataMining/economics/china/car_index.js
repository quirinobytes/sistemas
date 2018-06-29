var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');
fields = ['valor_TOTAL_VEHICLE_SALES','valor_CAR_PRODUCTION','valor_CAR_REGISTRATIONS'];



crawler = {
	interval: 100,
	getSample: 'http://www.tradingeconomics.com/china/car-registrations',
	get: 'http://www.tradingeconomics.com/china/car-registrations',
  preview: 3,
	extractors: [
		{
		selector: '#aspnetForm div.container div.row div.col-lg-8.col-md-9 div:nth-child(9) div table',
		callback: function (err,html,url,response) {
			data = {};
			data.valor_TOTAL_VEHICLE_SALES = html.children('tr').eq(9).children('td').eq(1).text();
			data.valor_CAR_PRODUCTION = html.children('tr').eq(10).children('td').eq(1).text();
			data.valor_CAR_REGISTRATIONS = html.children('tr').eq(11).children('td').eq(1).text();
			data.url = url;
			console.log(data);
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('../../../csv/all/economics-china-car_index.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});
			}
		}
	]

}

crawlerjs(crawler);

