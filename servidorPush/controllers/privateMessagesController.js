const { query } = require('express')
var PrivateMessage = require ("../models/privateMessage.js")


exports.save = function (id,toAndFrom,from,to,message,time,identificador,callback){
	new PrivateMessage({
	    'id': id,
		'toAndFrom': toAndFrom,
		'from': from,
		'to': to,
		'message': message,
		'time': time,
		'identificador':identificador
	}).save(function(error, privatemessage){
		if (error){
			callback({error: 'ERRO: Não foi possível salvar a mensagem privada'});
		}else{
			callback(privatemessage);
		}
	});
}

exports.list = function (callback){
	PrivateMessage.find({}, function(error, privatemessage) {
		if (error){
			callback ({error: "Não foi possível listar as mensagens privadas"});
		}else{
			callback(privatemessage);
		}
	});
}

exports.votaramSim = function (identificador,callback){
	PrivateMessage.findOne({identificador: identificador  })
	  .then(doc => {
		// console.log(doc._id)
		  PrivateMessage.findByIdAndUpdate(doc._id, { $inc:{ votossim: 1 }},function (err, docs) {
			  if (err)	callback ({err: "Não foi possível incrementar os votos de sim para esse identificador"})
			  else callback(doc.votossim+1)
		  });
	  })
	  .catch(err => {callback ({error: "Não foi possível localizar esse identificador para incrementar"}) })
}

exports.votaramNao = function (identificador,callback){
	PrivateMessage.findOne({identificador: identificador})
	  .then(doc => {
		// console.log(doc._id)
		  PrivateMessage.findByIdAndUpdate(doc._id, { $inc:{ votosnao: 1 }},function (err, docs) {
			  if (err)  callback ({err: "Não foi possível incrementar os votos de nao para esse identificador"})
			  else callback(doc.votosnao+1)
		  });
	  })
	  .catch(err => {callback ({err: "Não foi possível localizar esse identificador para incrementar"}) })

}

// resgatar as proximas 20 mensagens a partir de "aposNItens" mensagens.
exports.ultimos10 = function (toAndFrom, aposNItens, callback){
	var query = PrivateMessage.find({toAndFrom:toAndFrom}).sort({time:1}).limit(20).skip(aposNItens);
	query.exec(function(error, privatemessage){
		if(!error){
			callback(privatemessage);
		}
		else{
			callback({resposta: "Nao foi possivel resgatar mais ultimos10 mensagens a partir do item: "+aposNItens});
		}
	});
}

exports.delete = function (id, callback){
	PrivateMessage.findById(id, function(error, privatemessage){
		if (error){
			callback({error: "Não foi possivel excluir a mensagem"});
		}
		else{
			PrivateMessage.remove({_id: id},function(error){
				if(!error){
					callback({resposta: "Mensagem excluida com sucesso"});
				}
			});
		}
	})
}


