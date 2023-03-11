// CONFIGURACAO DO BANCO DE DADOS.

const mongoose = require('mongoose')

//mongoose.set('strictQuery', false)

mongoose.Promise = global.Promise;

var strConnection = 'mongodb://localhost/chatPVT';

var options = {
//    useMongoClient: true,
    autoIndex: true, // Don't build indexes
 // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//    reconnectTries: 10, // Never stop trying to reconnect
//    reconnectInterval: 500, // Reconnect every 500ms
//    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
//    bufferMaxEntries: 0
  };

// new MongoClient(strConnection, {promiseLibrary: BluebirdPromise})

mongoose.connect(strConnection, options, function (err,res ){
 if (err){
	 console.log('Não foi possivel conectar a: '+ strConnection+"\n erro:")
   console.log(err)
 }
  else
 	  console.log('° Conectado a: ' + strConnection)
})


module.exports = { mongoose }
