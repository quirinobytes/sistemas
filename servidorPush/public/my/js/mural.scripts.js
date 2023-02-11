// MURAL SCRIPTS 

var contadorMuralMensagens = 0;

function enviarMensagemEOUFoto(){
	//console.log("to na enviarMensagemEOUFoto("+$("#message").val()+")")
	
	if (! $("#message").val()){ // ver se tem mensagem no textearea
		if ( $("#filetoupload").get(0).files.length == 0 ){  //ver se tem imagens para enviar
			return
			// alert("Nao tem fotos nem texto")
		}
	 	else { //entao so tem imagem para enviar
			$("#formSendImagemToMural").submit();
			 // alert("so tem  foto")
		}
	}
	else {//entao o textearea tem mensagem, envia e depois vamos ver se tem fotos
		if (!$('#filetoupload').val() ){ //verifica se tem imagem
			// console.log("numero de arquivos"+$("#filetoupload").get(0).files.length)
			// alert("so tem mensagem")
			send_message.click();
		}
		else{ //entao tem imagem e mensagem para enviarem juntos
			// console.log("numero de arquivos"+$("#filetoupload").get(0).files.length)
			copyMessageToAddInPhotoIfExist()
			$("#formSendImagemToMural").submit();
		}
	}
}

function copyMessageToAddInPhotoIfExist(){
	texto = $("#messageInAttach")
	str = $("#message").val()
	texto.val(str)
}

function auto_height(elem) {  /* javascript */
    elem.style.height = "1px";
    elem.style.height = (elem.scrollHeight)+"px";
}


$(function(){
   	//make connection direct on web server using relative hosts 
	//var socket = io.connect('http://servidorpush.ddns.net:3000/', { secure: true, reconnect: true, rejectUnauthorized : false })
	var socket = io.connect('/', { secure: true, reconnect: true, rejectUnauthorized : false })

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var loggeduser = $("#loggeduser")
	var container = $("#container")

	

	// Logo que a pagina carregar "document.ready()", pega a lista de usuários 
	// e o historico do board para ser carregado na section "chatroom"
	$( document ).ready(function() {

		//qdo carregar a pagina já se apresente e faça o login
		socket.emit('username', {username : loggeduser.text()});

		carregaMaisAlguns(contadorMuralMensagens);
		console.log(contadorMuralMensagens)

		$('div.container').on('scroll', function() {
			if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
				carregaMaisAlguns(contadorMuralMensagens);
			}
		})

		//carregando o historico de mensagens do Mural
		// $.ajax({
		// 	url: "ultimos10/10"
		// }).then(function(data) {
		// 	data.forEach(item => { 
				
		// 		var dt = new Date(item.time);
		// 		const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
				
		// 		if (item.username == loggeduser.text()){
		// 			// console.log("carregando mensagens do usuario")
		// 			chatroom.append( "<p class='message'> <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png' />  <font color='gray'>  " + hora + "</font> <b>[" + item.username + "]</b> " + item.message + "</p>") 
		// 		}
		// 		else{
		// 			// console.log("carregando mensagens de alguem")
		// 			chatroom.append( "<p class='message' style='text-align:right'>"+ item.message + " <b>[" + item.username + "]</b> <font color='gray'>  " + hora + "</font> " + " <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png' /> </p> ") 
		// 		}
		// 	});
   		// });

		// Aqui estou pegando a lista dos usuários do konga
		$.ajax({
			url: "./consumers"
			}).then(function(obj_consumers) {
				usuarios_kong = obj_consumers.data;
				usuarios_kong.forEach(item => { 
                    //contactTo.append( "<p class='message'>[" + item.username + "]</p>");
					//contactTo.append( '<div>' + item.username + '</div>');
					contactList.innerHTML += "<div id='contacts' onclick='loadChatWith(this.innerHTML);'>" + item.username + "</div>";
                });
   			});

		//Appending HTML5 Audio Tag in HTML Body
		$('').appendTo('body');
	})

	//Emit message
	send_message.click(function(){
		texto = message.val()
		var dt = new Date();
		const time = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
		
		//enviar a mensagem no canal 'message' somente se houver username e mensagem
		if (username && texto)
		socket.emit('message', {message: texto.trim(), username:username, time:dt})
		//limpar o inputbox do message, depois que enviar mensagem, e chamar a auto dimensionar o textarea
		message.val('')
		//redimenciar o textearea caso ele tenha ficado grande com o texto que o usuaŕio digitou no box.
		message.attr("rows","1")
	})

	// Wait on new_message on channel "message"
	socket.on("message", (data) => {
		//limpar o campo que indica que um usuário está digitando: User is typing a message...
		feedback.html('');
    	// console.log("to na socket.on(message=("+data.message+")");
    	var dt = new Date(data.time);
   		const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
		  
		    if (data.username == loggeduser.text())
				chatroom.append("<p class='message'> <img class='miniAvatar' src='usersAvatar/"+data.username+"-user-icon.png'/> <font color='gray'>" + hora + "</font> <b>[" + data.username + "]</b> " + data.message + "</p>") 
	        else
			    chatroom.append("<p class='message' style='text-align:right'>"+ data.message + " <b>[" + data.username + "]</b> <font color='gray'>" + hora + "</font><img class='miniAvatar' src='usersAvatar/"+data.username+"-user-icon.png' /> </p> ") 

		//fazer o scroll down a cada mensagem nova.
		container.animate({"scrollTop": $('#chatroom')[0].scrollHeight}, "slow")
		
		//play sound when new message arrives but not in my chat.
		if (data.username != loggeduser.text()){
			// console.log(data.username + " | " + loggeduser.text())
		    $('#playSoundOnNewMessage')[0].play();
		}

		//incrementa o contador para qdo ele chamar mais, nao vir as que ja vieram pelo socket.io
		contadorMuralMensagens++;
	})

	//Emit a username when click on send_username button.
	send_username.click(function(){
		socket.emit('username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing',{username:username.val()})
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})

	
	function carregaMaisAlguns(aposXItens){
		$.ajax({
			url: "ultimos10/"+aposXItens
		}).then(function(data) {
			if (data.length > 0){
				contadorMuralMensagens+= 10
				data.forEach(item => { 
					var dt = new Date(item.time);
					const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
					
					if (item.username == loggeduser.text()){
						chatroom.append( "<p class='message'> <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png' />  <font color='gray'>  " + hora + "</font> <b>[" + item.username + "]</b> " + item.message + "</p>") 
					}
					else{
						chatroom.append( "<p class='message' style='text-align:right'>"+ item.message + " <b>[" + item.username + "]</b> <font color='gray'>  " + hora + "</font> " + " <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png' /> </p> ") 
					}
				});
			}
			else{
				console.log("Nao tem mais nada pra vir")
			}
		});
	}
});