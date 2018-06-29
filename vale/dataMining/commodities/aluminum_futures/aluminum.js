var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_ALUMINUM','valorizacao_ALUMINUM','percentual_ALUMINUM'];
var data;



crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/commodities/aluminum',
	get: 'http://www.investing.com/commodities/aluminum',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_ALUMINUM = html.children('span').eq(0).text();
								data.valorizacao_ALUMINUM = html.children('span').eq(1).text();
								data.percentual_ALUMINUM = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}


function gravarCSV (data) {
      if (data.valor_ALUMINUM && data.valorizacao_ALUMINUM && data.percentual_ALUMINUM) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_ALUMINUM + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_ALUMINUM + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_ALUMINUM + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/aluminum.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);

