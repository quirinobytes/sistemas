var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_COOPER_UK','valorizacao_COOPER_UK','percentual_COOPER_UK'];



crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/commodities/copper?cid=959211',
	get: 'http://www.investing.com/commodities/copper?cid=959211',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_COOPER_UK = html.children('span').eq(0).text();
								data.valorizacao_COOPER_UK = html.children('span').eq(1).text();
								data.percentual_COOPER_UK = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}

function gravarCSV (data) {
      if (data.valor_COOPER_UK && data.valorizacao_COOPER_UK && data.percentual_COOPER_UK) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_COOPER_UK + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_COOPER_UK + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_COOPER_UK + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/cooper_UK.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
