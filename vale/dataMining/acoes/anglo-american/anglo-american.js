var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_ANGLO','valorizacao_ANGLO','percentual_ANGLO'];
var data;


crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/equities/anglo-american',
	get: 'http://www.investing.com/equities/anglo-american',
    preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_ANGLO = html.children('span').eq(0).text();
								data.valorizacao_ANGLO = html.children('span').eq(1).text();
								data.percentual_ANGLO = html.children('span').eq(3).text();
								gravarCSV(data);
							    }
					}
				]
}

function gravarCSV(data) {
      if (data.valor_ANGLO && data.valorizacao_ANGLO && data.percentual_ANGLO) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_ANGLO + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_ANGLO + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_ANGLO + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/anglo-american.csv', csv, function(err){ if (err) throw err; });
      }
}
crawlerjs(crawler);
