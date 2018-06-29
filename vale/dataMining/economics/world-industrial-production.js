var crawlerjs = require('crawler-js');


crawler = {
	interval: 100,
	getSample: 'http://www.tradingeconomics.com/china/industrial-production',
	get: 'http://www.tradingeconomics.com/china/industrial-production',
  preview: 3,
	extractors: [
		{
		selector: '.panel-default .table-responsive table tr',
		callback: function (err,html,url,response) {
			data = {};
			data.texto = html.children('td').eq(0).children('a').text();
			data.last = html.children('td').eq(1).text();
			data.previous = html.children('td').eq(3).text();
			data.url = url;
			console.log(data);
			}
		}
	]

}

crawlerjs(crawler);

