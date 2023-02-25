const { query } = require('express')
var ChatMessage = require ("../models/chatMessage.js")


exports.save = function (id,username,message,time,identificador,callback){
	new ChatMessage({
		'id': id,
		'username': username,
		'message': message,
		'time': time,
		'identificador':identificador
	}).save(function(error, chatmessage){
		if (error){
			callback({error: 'Não foi possível salvar a mensagem id= '+id});
		}else{
			callback(chatmessage);
		}
	});
}

exports.list = function (callback){
	ChatMessage.find({}, function(error, chatmessage) {
		if (error){
			callback ({error: "Não foi possível encontrar as Mensagens"});
		}else{
			callback(chatmessage);
		}
	});
}

exports.votaramSim = function (identificador,callback){
	ChatMessage.findOne({identificador: identificador  })
	  .then(doc => {
		// console.log(doc._id)
		  ChatMessage.findByIdAndUpdate(doc._id, { $inc:{ votossim: 1 }},function (err, docs) {
			  if (err)	callback ({err: "Não foi possível incrementar os votos de sim para esse identificador"})
			  else callback(doc.votossim+1)
		  });
	  })
	  .catch(err => {callback ({error: "Não foi possível localizar esse identificador para incrementar"}) })
}

exports.votaramNao = function (identificador,callback){
	ChatMessage.findOne({identificador: identificador})
	  .then(doc => {
		// console.log(doc._id)
		  ChatMessage.findByIdAndUpdate(doc._id, { $inc:{ votosnao: 1 }},function (err, docs) {
			  if (err)  callback ({err: "Não foi possível incrementar os votos de nao para esse identificador"})
			  else callback(doc.votosnao+1)
		  });
	  })
	  .catch(err => {callback ({err: "Não foi possível localizar esse identificador para incrementar"}) })

}

// resgatar as proximas 10 mensagens a partir de "aposNItens" mensagens.
exports.ultimosItens = function (aposNItens, callback){
	var query = ChatMessage.find({}).sort({time:1}).limit(10).skip(aposNItens);
	query.exec(function(error, chatmessage){
		if(!error){
			callback(chatmessage);
		}
		else{
			callback({resposta: "Nao foi possivel resgatar no maximo 10 mensagens a partir do item: "+aposNItens});
		}
	});
}

exports.getVotosPorIdentificador = function (identificador, callback){
	ChatMessage.findOne({identificador: identificador})
	.then(doc => {
	   retorno = {identificador:doc.identificador,votossim:doc.votossim, votosnao:doc.votosnao}
	   callback(retorno)
	})
	.catch(err => {callback ({err: "Não foi possível localizar esse identificador para pegar o votos"}) })
}

exports.delete = function (id, callback){
	ChatMessage.findById(id, function(error, chatmessage){
		if (error){
			callback({error: "Não foi possivel excluir a mensagem"});
		}
		else{
			ChatMessage.remove({_id: id},function(error){
				if(!error){
					callback({resposta: "Mensagem excluida com sucesso"});
				}
			});
		}
	})
}


