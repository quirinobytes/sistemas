var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');
fields = ['valor_INDUSTRIAL_PRODUCTION_ACTUAL','valor_INDUSTRIAL_PRODUCTION_Q4_16','valor_INDUSTRIAL_PRODUCTION_Q1_17','valor_INDUSTRIAL_PRODUCTION_Q2_17','valor_INDUSTRIAL_PRODUCTION_Q3_17','valor_INDUSTRIAL_PRODUCTION_2020'];



crawler = {
	interval: 100,
	getSample: 'http://www.tradingeconomics.com/china/industrial-production/forecast',
	get: 'http://www.tradingeconomics.com/china/industrial-production/forecast',
  preview: 3,
	extractors: [
		{
		selector: '#ctl00_ContentPlaceHolder1_ctl00_IndicatorForecastUC_PanelDefinition table',
		callback: function (err,html,url,response) {
			data = {};
			data.texto = "China Industrial Production"; 
			data.valor_INDUSTRIAL_PRODUCTION_ACTUAL = html.children('tr').children('td').eq(1).text();
			data.valor_INDUSTRIAL_PRODUCTION_Q4_16 = html.children('tr').children('td').eq(2).text();
			data.valor_INDUSTRIAL_PRODUCTION_Q1_17 = html.children('tr').children('td').eq(3).text();
			data.valor_INDUSTRIAL_PRODUCTION_Q2_17 = html.children('tr').children('td').eq(4).text();
			data.valor_INDUSTRIAL_PRODUCTION_Q3_17 = html.children('tr').children('td').eq(5).text();
			data.valor_INDUSTRIAL_PRODUCTION_2020 = html.children('tr').children('td').eq(6).text();
			data.url = url;
			console.log(data);
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('../../../csv/all/economics-china-industrial_production.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});

			}
		}
	]

}

crawlerjs(crawler);

