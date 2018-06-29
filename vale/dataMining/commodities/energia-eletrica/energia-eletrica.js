var crawlerjs = require('crawler-js');
var fs = require('fs');
var fields = ['valor_ponta_ENERGIA_ELETRICA','valor_fora_ponta_ENERGIA_ELETRICA','valor_ultrapassagem_ponta_ENERGIA_ELETRICA'];
var data;


crawler = {
	interval: 100,
	getSample: 'https://www.aeseletropaulo.com.br/poder-publico/prazos-e-tarifas/conteudo/tarifa-de-energia-eletrica',
	get: 'https://www.aeseletropaulo.com.br/poder-publico/prazos-e-tarifas/conteudo/tarifa-de-energia-eletrica',
    preview: 3,
	extractors: [
					{
					selector: '#ctl00_SPWebPartManager1_g_05e7f7cc_6e08_4fa0_801d_af831cb60dc7_ctl00_divTarifasCorporativo table:nth-child(2)',
					callback: function (err,html,url,response) {
								console.log(html);
								data = {};
								data.valor_ponta_ENERGIA_ELETRICA = html.text();
								data.valor_fora_ponta_ENERGIA_ELETRICA = html.children('tr').eq(1).children('td').eq(0).text();
								data.valor_ultrapassagem_ponta_ENERGIA_ELETRICA = html.children('tr').eq(2).children('td').eq(0).text();
								console.log(data);
								gravarCSV(data);
								}
					}
				]
}

function gravarCSV(data){
		console.log("DATA="+ data);
      if ( data.valor_ponta_ENERGIA_ELETRICA && data.valor_fora_ponta_ENERGIA_ELETRICA && data.valor_ultrapassagem_ponta_ENERGIA_ELETRICA) {
          csv = '"'+ fields[0] + '"';
          csv+= ',';
          csv+= '"'+ fields[1]+ '"';
          csv+= ',';
          csv+= '"'+ fields[2]+ '"';
          csv+= '\n';
          csv+= '"'+ data.valor_ponta_ENERGIA_ELETRICA + '"';
          csv+= ',';
          csv+= '"'+ data.valor_fora_ponta_ENERGIA_ELETRICA + '"';
          csv+= ',';
          csv+= '"'+ data.valor_ultrapassagem_ponta_ENERGIA_ELETRICA + '"';
          fs.writeFile('../../../csv/all/energia-eletrica.csv', csv, function(err){ if (err) throw err; });
      }
}

crawlerjs(crawler);

