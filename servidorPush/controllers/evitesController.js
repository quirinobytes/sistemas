const { query } = require('express')
var EviteModel = require ("../models/eviteModel.js")
const crypto = require('crypto')
const fs = require('fs')
const { imageHash } = require('image-hash');


fs.readFile("/root/chatPVT.key", function (error,data){
	if(error) 
		console.log("nao foi possivel ler a key para gerar o Hash das midias")
	else{
		const key = data.toString('binary').split('::', 2);
		console.log("key = ") 
		console.log(key)
	}
})

let byte = crypto.randomBytes(8);
const hash = crypto.createHash('sha256')

for (let i = 5; i < 9; i++) {
    hash.update(byte + i)
}
console.log(hash.digest('hex'))





exports.save = function ({identificador:identificador, filepath:filepath, votosnao:votosnao, from:from }, callback){
	var buff
	var path = process.cwd()
	path = path + "/" + filepath.toString()

	imageHash(path, 16, true, (error, hash) => {
		if (error) {
			console.log("Erro: Deu erro ao tentar gerar o hash da imagem na imageHash()")
			throw error;
		}
		else {
			new EviteModel({
				"identificador": identificador,
				'from': from,
				"hash": hash,
				"votosnao": votosnao
			}).save(function(error, data){
				if (error){
					console.log("error = ") 
					console.log(error)
					callback({error: 'ERRO: Não foi possível salvar esse evite'})
				}else{
					callback(data)
				}
			})
			
	 	}
	})
}

exports.list = function (callback){
	EviteModel.find({}, function(error, evite) {
		if (error){
			callback ({error:"Não foi possível listar as mensagens privadas"})
		}else{
			callback(evite)
		}
	})
}

exports.searchEviteByIdentificador = function (identificador,callback){
	EviteModel.findOne({identificador: identificador})
	.then(doc => { callback(doc) })
	.catch(error => {callback ({error: "Não foi possível localizar esse identificador para incrementar"}) })
}

exports.incEviteDezVezes = function (identificador,callback){
	EviteModel.findOne({identificador: identificador})
	.then(doc => {
		EviteModel.findByIdAndUpdate(doc._id, { $inc:{ eviteDezVezes: 1 }},function (error, docs) {
			if (error) callback ({error: "Não foi possível incrementar os eviteDezVezes para esse identificador"})
			else callback(docs.eviteDezVezes+1)
		})
	})
	.catch(error => {callback ({error: "Não foi possível localizar esse identificador para incrementar"}) })
}

exports.votaramNao = function (identificador,callback){
	EviteModel.findOne({identificador: identificador})
	  .then(doc => {
		// console.log(doc._id)
		  EviteModel.findByIdAndUpdate(doc._id, { $inc:{ votosnao: 1 }},function (err, docs) {
			  if (err)  callback ({err: "Não foi possível incrementar os votos de nao para esse identificador"})
			  else callback(doc.votosnao+1)
		  })
	  })
	  .catch(err => {callback ({err: "Não foi possível localizar esse identificador para incrementar"}) })

}

// resgatar as proximas 10 mensagens a partir de "aposNItens" mensagens.
exports.pioresVotos = function (time, aposNItens, callback){
	var query = EviteModel.find({time: {$gte : new ISODate("2023-01-01T20:15:31Z") }}).sort({votosnao:1}).limit(10).skip(aposNItens)
	query.exec(function(error, evitemodel){
		if(error){
			callback({error: "Nao foi possivel resgatar mais 10 mensagens a partir do item: ["+aposNItens+"]"})
		}
		else{
			callback(evitemodel)
		}
	})
}

exports.delete = function (id, callback){
	EviteModel.findById(id, function(error, evitemodel){
		if (error){
			callback({error: "Não foi possivel excluir a mensagem"})
		}
		else{
			EviteModel.remove({_id: id},function(error){
				if(error){
					callback({error: "Erro excluindo mensagem id:["+id+"]"})
				}
			})
		}
	})
}


