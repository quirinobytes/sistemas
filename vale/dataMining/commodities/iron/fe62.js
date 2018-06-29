var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');
var fields = ['valor_IRON_FE62','valorizacao_IRON_FE62','percentual_IRON_FE62'];
var data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/commodities/iron-ore-62-cfr-futures',
	get: 'http://www.investing.com/commodities/iron-ore-62-cfr-futures',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
									data = {};
									data.valor_IRON_FE62 = html.children('span').eq(0).text();
									data.valorizacao_IRON_FE62 = html.children('span').eq(1).text();
									data.percentual_IRON_FE62 = html.children('span').eq(3).text();
									gravarCSV(data);
									}
					}
				]
}

function gravarCSV (data) {
      if (data.valor_IRON_FE62 && data.valorizacao_IRON_FE62 && data.percentual_IRON_FE62) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_IRON_FE62 + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_IRON_FE62 + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_IRON_FE62 + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/iron-fe62.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
