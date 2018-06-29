var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_RIO_TINTO','valorizacao_RIO_TINTO','percentual_RIO_TINTO'];
var data;

crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/equities/rio-tinto-plc-exch',
	get: 'http://www.investing.com/equities/rio-tinto-plc-exch',
	preview: 3,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_RIO_TINTO = html.children('span').eq(0).text();
								data.valorizacao_RIO_TINTO = html.children('span').eq(1).text();
								data.percentual_RIO_TINTO = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}

function gravarCSV (data) {
      if (data.valor_RIO_TINTO && data.valorizacao_RIO_TINTO && data.percentual_RIO_TINTO) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_RIO_TINTO + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_RIO_TINTO + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_RIO_TINTO + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/rio-tinto.csv', csv, function(err){ if (err) throw err; });
      }
}
crawlerjs(crawler);
