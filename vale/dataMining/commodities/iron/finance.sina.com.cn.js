var request = require('request');
var fs = require('fs');
var fields = ['valor_IRON_SINA_CN','maximo_IRON_SINA_CN','minimo_IRON_SINA_CN','media_SINA_CN'];
var data;
var url = 'http://hq.sinajs.cn/&list=I0';

request({uri:url},function(error, response, body){

	array = body.split(',');
	data = {};
	data.valor_IRON_SINA_CN = array[7];
	data.maximo_IRON_SINA_CN = array[3];
	data.minimo_IRON_SINA_CN = array[4];
	data.media_IRON_SINA_CN = array[2];

	console.log(JSON.stringify(data));

gravarCSV(data);
});

function gravarCSV (data) {
      if (data.valor_IRON_SINA_CN && data.maximo_IRON_SINA_CN && data.minimo_IRON_SINA_CN) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_IRON_SINA_CN + '"';
          csv+= ',';
          csv+= '"'+ data.maximo_IRON_SINA_CN + '"';
          csv+= ',';
          csv+= '"'+ data.minimo_IRON_SINA_CN + '"';
          csv+= '\n';
          fs.writeFile('../../../csv/all/finance.sina.cn.com.csv', csv, function(err){ if (err) throw err; });
      }
}


