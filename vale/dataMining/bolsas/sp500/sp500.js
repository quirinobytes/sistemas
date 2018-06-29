var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_SP500','valorizacao_SP500','percentual_SP500'];
var data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/indices/us-spx-500',
	get: 'http://www.investing.com/indices/us-spx-500',
	preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_SP500 = html.children('span').eq(0).text();
								data.valorizacao_SP500 = html.children('span').eq(1).text();
								data.percentual_SP500 = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}
function gravarCSV (data) {
      if (data.valor_SP500 && data.valorizacao_SP500 && data.percentual_SP500) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_SP500 + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_SP500 + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_SP500 + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/sp500.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
