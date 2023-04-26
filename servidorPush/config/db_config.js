// CONFIGURACAO DO BANCO DE DADOS.

const mongoose = require('mongoose')


mongoose.Promise = global.Promise;

var   MONGO_SERVER=process.env['MONGO_SERVER']
const MONGO_SERVER_USERNAME=process.env['MONGO_SERVER_USERNAME']
const MONGO_SERVER_PASSWORD=process.env['MONGO_SERVER_PASSWORD']
const MONGO_SERVER_ROLE=process.env['MONGO_SERVER_ROLE']

 console.log("\n")
 console.log("\t\t __________________")
 console.log("\t\t | 🇧🇷 🇧🇷 🇧🇷 |  -> START <-")
 console.log("\t\t ------------------")
 

if ( MONGO_SERVER ) {
   console.log("\n☑ [CONFIG] Usando Env Var \$MONGO_SERVER= ["+process.env['MONGO_SERVER']+"]\n")

  if (MONGO_SERVER_USERNAME != "" && MONGO_SERVER_PASSWORD != "" ){
    var strConnection = "mongodb://"+MONGO_SERVER_USERNAME+":"+MONGO_SERVER_PASSWORD+"@"+MONGO_SERVER+"/"+MONGO_SERVER_ROLE;
    console.log("☑ [CONFIG] Mongodb: usando credenciais!")
    
  }
  else{
    var strConnection = "mongodb://"+process.env['MONGO_SERVER']+"/chatPVT";
    console.log("☢[INFO] Mongodb: somente SERVER HOSTNAME, sem credenciais!")
  }

 } else {
    var strConnection = 'mongodb://localhost/chatPVT';
    MONGO_SERVER = 'localhost'
    console.log("☢ [INFO] Mongodb: sem nenhum ENV_VAR de conexão encontrada, usando 'str=default' !")
 }



var options = {
autoIndex: true, // Don't build indexes
// useMongoClient: true,


    //tudo da pau abaixo:
                        // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
                        //    reconnectTries: 10, // Never stop trying to reconnect
                        //    reconnectInterval: 500, // Reconnect every 500ms
                        //    poolSize: 10, // Maintain up to 10 socket connections
                        // If not connected, return errors immediately rather than waiting for reconnect
                        //    bufferMaxEntries: 0
};

// new MongoClient(strConnection, {promiseLibrary: BluebirdPromise})

//mongoose.set('strictQuery', false)
mongoose.set('strictQuery', true)
console.log('⌛[WAIT] Mongodb: conectando ao servidor ...')

mongoose.connect(strConnection, options, function (err,res ){
 if (err){
	 console.log('❌ [ERROR] Não foi possivel conectar ao servidor mongodb '+ strConnection+"\n erro:")
   console.log(err)
 }
  else
 	  console.log('🏆[SUCCESS] Mongodb: conectado com sucesso ao servidor [' + MONGO_SERVER +"]")
})


module.exports = { mongoose }
