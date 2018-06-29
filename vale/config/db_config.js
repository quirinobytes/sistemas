// CONFIGURACAO DO BANCO DE DADOS.

var mongoose = require('mongoose');
var strDBConnect = 'mongodb://localhost/API';


mongoose.connect(strDBConnect, function (err,res ){
 if (err)
	 console.log('Não foi possivel conectar a: '+ strDBConnect);
  else
 	console.log('° Conectado a: ' + strDBConnect.yellow+ "......................................... ".grey + "OK \n".green);
});


