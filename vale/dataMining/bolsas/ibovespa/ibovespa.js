var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_IBOVESPA','valorizacao_IBOVESPA','percentual_IBOVESPA'];
var data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/indices/ibovespa-futures',
	get: 'http://www.investing.com/indices/ibovespa-futures',
	preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_IBOVESPA = html.children('span').eq(0).text();
								data.valorizacao_IBOVESPA = html.children('span').eq(1).text();
								data.percentual_IBOVESPA = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}

function gravarCSV(data) {
      if (data.valor_IBOVESPA && data.valorizacao_IBOVESPA && data.percentual_IBOVESPA) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_IBOVESPA + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_IBOVESPA + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_IBOVESPA + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/ibovespa.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);

