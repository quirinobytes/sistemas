const { query } = require('express')
var ChatMessage = require ("../models/chatMessage.js")


exports.save = function (id,username,message,time,callback){
	new ChatMessage({
		'id': id,
		'username': username,
		'message': message,
		'time': time
	}).save(function(error, chatmessage){
		if (error){
			callback({error: 'Não foi possível salvar'});
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

// resgatar as proximas 20 mensagens a partir de "aposNItens" mensagens.
exports.ultimos10 = function (aposNItens, callback){
	var query = ChatMessage.find({}).sort({time:1}).limit(20).skip(aposNItens);
	query.exec(function(error, chatmessage){
		if(!error){
			callback(chatmessage);
		}
		else{
			callback({resposta: "Nao foi possivel resgatar mais ultimos10 mensagens a partir do item: "+aposNItens});
		}
	});
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


