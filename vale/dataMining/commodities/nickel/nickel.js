var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_NICKEL','valorizacao_NICKEL','percentual_NICKEL'];
var data;



crawler = {
	interval: 100,
	getSample: 'http://www.investing.com/commodities/nickel?cid=959208',
	get: 'http://www.investing.com/commodities/nickel?cid=959208',
	preview: 0,
	extractors: [
					{
					selector: 'div div div div div .top',
					callback: function (err,html,url,response) {
								data = {};
								data.valor_NICKEL = html.children('span').eq(0).text();
								data.valorizacao_NICKEL = html.children('span').eq(1).text();
								data.percentual_NICKEL = html.children('span').eq(3).text();
								gravarCSV(data);
								}
					}
				]
}
function gravarCSV (data) {
      if (data.valor_NICKEL && data.valorizacao_NICKEL && data.percentual_NICKEL) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_NICKEL + '"';
          csv+= ',';
          csv+= '"'+ data.valorizacao_NICKEL + '"';
          csv+= ',';
          csv+= '"'+ data.percentual_NICKEL + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/nickel.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);
