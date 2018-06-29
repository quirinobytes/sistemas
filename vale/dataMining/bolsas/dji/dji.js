var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_DJI','valorizacao_DJI','percentual_DJI'];
var data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/indices/us-30',
	get: 'http://www.investing.com/indices/us-30',
	preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_DJI = html.children('span').eq(0).text();
								data.valorizacao_DJI = html.children('span').eq(1).text();
								data.percentual_DJI = html.children('span').eq(3).text();
								gravarCSV(data);
			}
		}
	]

}

function gravarCSV (data) {
      if (data.valor_DJI && data.valorizacao_DJI && data.percentual_DJI) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_DJI + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_DJI + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_DJI + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/dji.csv', csv, function(err){ if (err) throw err; });
      }
}



crawlerjs(crawler);
