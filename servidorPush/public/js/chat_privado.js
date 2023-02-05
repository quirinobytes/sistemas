
var globalContatosList = [];


function loadChatWith(username) {

	var usr = $("#myname");
	var messageTo = $("#divMessageTo");
	var imgContactTo = $("#imgContactTo");
	var cList  = $("#contactList");

	imgContactTo.attr("src",username+"-user-icon.png");
	
	for (cont=0;cont<cList[0].children.length;cont++){
		if (cList[0].children[cont].innerText == username )
			$( cList[0].children[cont]).removeClass("temMensagemNaoLida");
	}
	//Limpar a lista no div=contacts caso tenha mensagemNaoLida, agora no carregamento. 
	

	//Limpa o board do chat
	console.log ("aqui foi chamado a loadChatWith("+username+") -> emptying messages in the Privado");
	messageTo.empty();

	divContato.innerHTML = username;

	//mostrar nome do loggedUser
	//console.log(usr[0].innerText);
	
	myname = usr[0].innerText ;
	$.ajax({
			url: "./rest/loadChatWith/"+myname+"/"+username
	}).then(function(data) {
	
		//mostrar as mensagens de retorno
		//console.log("MOSTRANDO o RETORNO DO HISTORICO")
		//console.log(data);
		//ret = findValueByPrefix(data,username)
		//console.log(ret);

		data.forEach(item => { 
			console.log("ITEM:");
			console.log()
			de = item[0].from;
			para = item[0].to;
			mensagem = item[0].message;
			  var dt = new Date(item[0].time);
			  const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
			  messageTo.append("<p class='message'><font color='gray'>  " + hora + "</font> <b>[" + de + "]</b> " + mensagem + "</p>") 
		});
    });
} 


function removeClassTemMensagemNaoLida(username){
	$("#contacts:contains("+username+")").removeClass("temMensagemNaoLida");
}
function usuarioLogado(nome){
	$("#"+nome+"_logged_user").addClass("logged_user");
}
function usuarioDeslogado(nome){
	$("#"+nome+"_logged_user").removeClass("logged_user");
}
function blinkLoggedUsers(){

	//limpando tudo antes
	globalContatosList.forEach( item => {
		if (item.username != undefined ) {
			console.log(item.username);
			usuarioDeslogado(item.username);
		}
	});

	$.ajax(
		{ url: "./logged_users"
		}).then(function(lista) {
			console.log("GET /logged_users: " +lista)
				lista.forEach(item =>{
					//console.log("vou chamar a usuarioLogado("+item+")")
					usuarioLogado(item);
				});
	});

}

$(function(){
   	//make connection direct on web server using relative hosts 
	  //var socket = io.connect('http://servidorpush.ddns.net:3000/', { secure: true, reconnect: true, rejectUnauthorized : false })
	var socket = io.connect('/', { secure: true, reconnect: true, rejectUnauthorized : false })

	//buttons and inputs
	var myname = $("#myname")
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var divMessageTo = $("#divMessageTo")
	var contactTo = $("#contactTo")
	var feedback = $("#feedback")
	var loggeduser = $("#loggeduser")
	var container = $("#container")
	var cList  = $("#contactList");
	var logged_users = {};
	

	$( document ).ready(function() {

		socket.emit('username', {username : myname.text()});

		$.ajax(
			{ url: "./logged_users"
			}).then(function(obj) {
			let logged_users = obj;
			console.log("LOGGED USERS");
			console.log(logged_users);
			});
		
		// Aqui estou pegando a lista dos usuários do "konga"
		// o /consumers é um api gateway para dentro do konga na 8001, control plane port
		$.ajax(
			{ url: "./consumers"
			}).then(function(obj_consumers) {
				
				usuarios_kong = obj_consumers.data;
				console.log(usuarios_kong);
				//salvando na variavel global para usar no blinkLoggedUsers
				globalContatosList = usuarios_kong;

				usuarios_kong.forEach(item => { 
					
						//fazer isso para remover o nome do usuario logado e nao mostrar na lista de contatos, pois ele tmb esta na lista e nao faz sentido ele falar com ele.
						if ( item.username != myname[0].innerText )
    							contactList.innerHTML += "<div id='contactLine'> <div id='contacts' onclick='loadChatWith(this.innerHTML);'>" + item.username + "</div> <div id='"+item.username+"_logged_user' ></div> </div>";
				});

				//por fim deixar os usuarios logados com a bolinha verde.
				blinkLoggedUsers();
			});
	//Appending HTML5 Audio Tag in HTML Body
	$('').appendTo('body');

	})
	
	//Emit message
	send_message.click(function(){
		var dt = new Date();
        const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});

		var logged_usr = myname[0].innerText
		console.log("send_message.click("+message.val()+")");
		console.log("from:")
		console.log(logged_usr);
		socket.emit("contactTo", {message : message.val(),from:logged_usr,toContact:divContato.innerText,time:hora})

		//limpar o inputbox do message, depois que enviar mensagem
		message.val('');
	})

	

	//Wait on new_message
	

	//Emit a username when click on send_username button.
	send_username.click(function(){
		socket.emit('username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
	socket.on('newlogin', (data) => {
		blinkLoggedUsers();
		console.log("chamando a blickLoggedUsers()")
	})
	socket.on('logout', (name) => {
		console.log("desconectando o fulano:"+name)
		usuarioDeslogado(name);
	})

	socket.on('contactTo', (data) => {
		var dt = new Date(data.time);
        const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
		friendUsername=divContato.innerText;
		var usr = $("#myname");
		loggedUser = usr[0].innerText ;
		console.log("data.time");
		console.log(data.time);
		

	
		//colocar minhas mensagens com a pessoa e for mensagem para mim, no board.
		if (data.toContact == friendUsername && data.from == loggedUser){
			
			//divMessageTo.append(data.message);
			
            //divMessageTo.append(data.time +": [" + data.from +"] " + data.message + "</br> ")
			divMessageTo.append("<p class='message'><font color='gray'>  " + data.time + "</font> <b>[" + data.from + "]</b> " + data.message + "</p>");
		}
		else{ //caso o board do seu contato nao esteja selecionado, e nao seja o seu board
			if (data.toContact == loggedUser && data.from != divContato.innerText){
				//console.log(cList[0])
				console.log("tamanho= "+cList[0].children.length);
				var cont =0;
				//$("#contacts:contains("+data.from+")").attr("style","font-weight:bold");
				//$("#contacts:contains("+data.from+")").attr("style","color:red");
				//$("#contacts:contains("+data.from+")").addClass("temMensagemNaoLida");
				
				
				
			//caso nao estava no board, rastreiar os outros para destacar como MENSAGEM NAO LIDA.
				for (cont=0;cont<cList[0].children.length;cont++){

					if (cList[0].children[cont].innerText == data.from ){
						console.log( "ACHEI: Alterando o div do: " + cList[0].children[cont].innerText);
						$( cList[0].children[cont]).addClass("temMensagemNaoLida");
						// cList[0].children(cont).
						$('#chatAudio')[0].play();
					}
				}
			}
		}
		//colocar as mensagens da pessoa para mim, no board e soa um bip
		if (data.from == divContato.innerText){
			//divMessageTo.append(data.time + ": [" + data.from +"] " + data.message + "</br> ")
			divMessageTo.append("<p class='message'><font color='gray'>  " + data.time + "</font> <b>[" + data.from + "]</b> " + data.message + "</p>");
			$('#chatAudio')[0].play();
		}
				
		
		
	})
	
});


