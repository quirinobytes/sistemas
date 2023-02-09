const { query } = require('express');
var ChatMessage = require ('../models/chatMessage');


exports.save = function (id,username,message,time,callback){
	new ChatMessage({
		'id': id,
		'username': username,
		'message': message,
		'time': time
	}).save(function(error, chatmessage){
		if (error){
			console.log(error)
			callback({error: 'Não foi possível salvar'});
		}else{
		callback(chatmessage);
		}
	});

}

exports.list = function (callback){
	ChatMessage.find({}, function(error, chatmessage) {
		if (error){
			callback ({error: "Não foi possível encontrar os produtos"});
		}else{
			callback(chatmessage);
		}
	});
}


exports.ultimos10 = function (aposNItens, callback){
	var query = ChatMessage.find({}).sort({time:1}).limit(20).skip(aposNItens);
			query.exec(function(error, chatmessage){
				if(!error){
					console.log("Achou aposNItens"+aposNItens);
					callback(chatmessage);
				}
				else
					callback({resposta: "Nao foi possivel usar a ultimos10 a partir do "+aposNItens});
			});
		}



// exports.last10 = function (jaLidos, callback){
// 	ChatMessage.find({{}.sort({time:1}).limit(10).skip(jaLidos)}, function(error, chatmessage) {
// 	// exec(exports.last10 = function (callback){
// 		if (error){
// 			callback ({error: "Não foi possível encontrar essa merda de mensage pelo last10"});
// 		}else{
// 			callback(chatmessage);
// 		}
// 	});
// }

exports.delete = function (id, callback){
	ChatMessage.findById(id, function(error, chatmessage){
		if (error){
			callback({error: "Não foi possivel excluir o produto"});
		}else{
			ChatMessage.remove({_id: id},function(error){
				if(!error){
					callback({resposta: "Produto excluido com sucesso"});
				}
			});
		}
	})
}


