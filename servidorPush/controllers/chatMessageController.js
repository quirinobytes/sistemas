const { query } = require('express')
var ChatMessageModel = require ("../models/chatMessageModel.js")


exports.save = function ({id,username,message,time,identificador,filepath}, callback){
	// console.log("filepath = ") 
	// console.log(filepath)
	new ChatMessageModel({
		'id': id,
		'username': username,
		'message': message,
		'filepath': filepath,
		'time': time,
		'identificador': identificador
	}).save(function(error, chatmessage){
		if (error){
			callback({error: "Não foi possível salvar a mensagem id= ["+id+"]"})
			// console.log("Ocorreu um erro na camada do controller da chatMessages")
			// console.log("error = ") 
			// console.log(error)
		}else callback(chatmessage)
	})
}

exports.list = function (callback){
	ChatMessageModel.find({}, function(error, chatmessage) {
		if (error){
			callback ({error: "Não foi possivel listar as mensagens"})
		}else{
			callback(chatmessage)
		}
	})
}

exports.pesquisar = function ({identificador }, callback){
	if (identificador) 
	
		ChatMessageModel.findOne({identificador:identificador})
		.then(doc => {
			//  console.log("doc encontrado"+doc)
			 callback(doc)
	    })
		.catch(err => {callback ({error: "Não foi possível localizar esse documento pelo identificador"}) })
}


exports.votaramSim = function (identificador,callback){
	ChatMessageModel.findOne({identificador: identificador})
	  .then(doc => {
		// console.log(doc._id)
		  ChatMessageModel.findByIdAndUpdate(doc._id, { $inc:{ votossim: 1 }},function (error, docs) {
			  if (error)	callback ({error: "Não foi possível incrementar os votos de sim para esse identificador"})
			  else callback(doc.votossim+1)
		  })
	  })
	  .catch(error => {callback ({error: "Não foi possível localizar esse identificador para incrementar"}) })
}

exports.votaramNao = function (identificador, callback){
	ChatMessageModel.findOne({identificador: identificador})
	.then(doc => {
		ChatMessageModel.findByIdAndUpdate(doc._id, { $inc:{ votosnao: 1 }}, function (error, docs) {
			if (error) callback ({error: "Não foi possível incrementar os votosNAO para esse identificador"})
			else callback(docs.votosnao+1)
		})
	})
	.catch(error => {callback ({error: "Não foi possível localizar esse identificador para incrementar"}) })

}

// resgatar as proximas 10 mensagens a partir de "aposNItens" mensagens.
exports.ultimosItens = function (aposNItens, callback){
	var query = ChatMessageModel.find({}).sort({time:1}).limit(10).skip(aposNItens)
	query.exec(function(error, chatmessage){
		if(!error){
			callback(chatmessage)
		}
		else{
			callback({resposta: "Nao foi possivel resgatar no maximo 10 mensagens a partir do item: "+aposNItens})
		}
	})
}

exports.getVotosPorIdentificador = function (identificador, callback){
	ChatMessageModel.findOne({identificador: identificador})
	.then(doc => {
	   retorno = {identificador:doc.identificador,votossim:doc.votossim, votosnao:doc.votosnao}
	   callback(retorno)
	})
	.catch(err => {callback ({err: "Não foi possível localizar esse identificador para pegar o votos"}) })
}

exports.delete = function (id, callback){
	ChatMessageModel.findById(id, function(error, chatmessage){
		if (error){
			callback({error: "Não foi possivel excluir a mensagem"})
		}
		else{
			ChatMessageModel.remove({_id: id},function(error){
				if(!error){
					callback({resposta: "Mensagem excluida com sucesso"})
				}
			})
		}
	})
}


