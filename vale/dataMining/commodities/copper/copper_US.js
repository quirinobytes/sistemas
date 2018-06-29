var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_COOPER_US','valorizacao_COOPER_US','percentual_COOPER_US'];
var data;

crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/commodities/copper',
	get: 'http://www.investing.com/commodities/copper',
	preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_COOPER_US = html.children('span').eq(0).text();
								data.valorizacao_COOPER_US = html.children('span').eq(1).text();
								data.percentual_COOPER_US = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}

function gravarCSV (data) {
      if ( data.valor_COOPER_US && data.valorizacao_COOPER_US && data.percentual_COOPER_US) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_COOPER_US + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_COOPER_US + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_COOPER_US + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/cooper_US.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
