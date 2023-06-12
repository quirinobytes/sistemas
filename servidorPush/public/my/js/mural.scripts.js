// MURAL SCRIPTS 
var contadorMuralMensagens = 0;

function enviarMensagemEOUFoto(){
	$("#loader").attr("style","display:block")
	//console.log("to na enviarMensagemEOUFoto("+$("#message").val()+")")
	
	if (! $("#message").val()){ // ver se tem mensagem no textearea
		if ( $("#filetoupload").get(0).files.length == 0 ){  //ver se tem imagens para enviar
			return
			// alert("Nao tem fotos nem texto")
		}
	 	else { //entao so tem imagem para enviar
			$("#formSendImagemToMural").submit()
			
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

function auto_height(elem) {  
    elem.style.height = "1px";
    elem.style.height = (elem.scrollHeight)+"px";
}
function votarSim(identificador){
	
	//alert("Votei sim no: "+identificador)	
	$.ajax({
		url: "./votaram/"+ identificador+"/sim"
		}).then(function(retorno) {
			//alert("fez o voto sim e nao veio erro")
			console.log("ok")
		}).fail(function(retorno){
			console.log("deu algum erro ao votar sim")	
			console.log(retorno)
		})
}

function votarNao(identificador){
	//alert("Votei nao no: "+identificador)	
	$.ajax({
		url: "./votaram/"+ identificador+"/nao"
		}).then(function(retorno) {
			console.log("ok")
		}).fail(function(retorno){
			console.log("deu algum erro ao votar nao")	
			console.log(retorno)
		})
}



$(function(){
   	//make connection direct on web server using relative hosts 
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
	var loader = $("#loader")
	
	
	// Logo que a pagina carregar "document.ready()", pega a lista de usuários 
	// e o historico do board para ser carregado na section "chatroom"
	$( document ).ready(function() {

		socket.emit('username', {username : loggeduser.text()});
		loadMuralPosts(contadorMuralMensagens);

		$('div.container').on('scroll', function() {
			//se chegar no fim, carrega mais alguns.
			if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-1) 
			loadMuralPosts(contadorMuralMensagens)
		})


		// Aqui estou pegando a lista de usuários "consumers" 
		// $.ajax({
		// 	url: "./consumers"
		// 	}).then(function(obj_consumers) {
		// 		usuarios_kong = obj_consumers.data;
		// 		usuarios_kong.forEach(item => { 
        //             //contactTo.append( "<p class='message'>[" + item.username + "]</p>");
		// 			//contactTo.append( '<div>' + item.username + '</div>');
		// 			contactList.innerHTML += "<div id='contacts' onclick='loadChatWith(this.innerHTML);'>" + item.username + "</div>";
        //         });
   		// 	});

		//Appending HTML5 Audio Tag in HTML Body
		$('').appendTo('body');

	})


	// Send message
	send_message.click(function(){
		texto = message.val()
		// var dt = new Date();
		// const time = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
		
		//enviar a mensagem no canal 'message' somente se houver username e mensagem
		if (username && texto){
			socket.emit('message', {message: texto.trim(), username:username})
		}
		//limpar o inputbox do message, depois que enviar mensagem, e chamar a auto dimensionar o textarea
		message.val('')
		//redimenciar o textearea caso ele tenha ficado grande com o texto que o usuaŕio digitou no box.
		message.attr("rows","1")
	})

	// On new message
	socket.on("message", (data) => {
		//limpar o campo que indica que um usuário está digitando: User is typing a message...
		feedback.html('');
    	//console.log("to na socket.on(message=("+data.message+")");
    	var dt = new Date(data.time);
   		const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
		  
		    if (data.username == loggeduser.text())
				chatroom.prepend("<div class='left'>  <p class='message'> <img class='miniAvatar' src='usersAvatar/"+data.username+"-user-icon.png'/> <b>[" + data.username + "]</b> <font color='gray'> " + hora + "</font> " + data.message + "</p> </div>")
	        else
				chatroom.prepend("<div class='right'> <p class='message'> <img class='miniAvatar' src='usersAvatar/"+data.username+"-user-icon.png'/> <b>[" + data.username + "]</b> <font color='gray'> " + hora + "</font>  "+ data.message + "</p> </div>" ) 
				
		//fazer o scroll down a cada mensagem nova.
		container.animate({"scrollTop": $('#chatroom:last-child').outerHeight()}, "slow")
		
		//play sound when new message arrives but not in my chat.
		if (data.username != loggeduser.text()){
			// console.log(data.username + " | " + loggeduser.text())
		    $('#playSoundOnNewMessage')[0].play();
		}

		//incrementa o contador para qdo ele chamar mais, nao vir as que ja vieram pelo socket.io
		contadorMuralMensagens++;
	})

	//Send a username when click on send_username button.
	send_username.click(function(){
		socket.emit('username', {username : username.val()})
	})

	//Send typing
	message.bind("keypress", () => {
		socket.emit('typing',{username:username.val()})
	})

	//On someone typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})

	socket.on('votosnamidia', (votacao) => {
		opcao = votacao.opcao
		identificador = votacao.identificador
		qtde = votacao.qtde

		if (opcao == 'like'){
			var votossim = $("#"+identificador+"_"+opcao)
			// console.log(identificador+"."+opcao + "=" + qtde)
			votossim[0].innerHTML = qtde
		}
		if (opcao == 'dislike'){
			var votosnao = $("#"+identificador+"_"+opcao)
			// console.log(identificador+"."+opcao + "=" + qtde)
			votosnao[0].innerHTML = qtde
		}
	})
	

	//#####################################
	// function carregaMaisAlguns(aposXItens){
	// 	$.ajax({
	// 		url: "ultimosItensChatMessage/"+aposXItens
	// 	}).then(function(data) {
	// 		if (data.length > 0){

	// 			// isso tem q ir pro fim, no fim incremente caso tudo tenha dado certo, somente no final, senao pode dar ruim.
	// 			contadorMuralMensagens+= data.length
				
	// 			data.forEach(item => { 
	// 				var dt = new Date(item.time);
	// 				const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
	// 				if (item.username == loggeduser.text()){
	// 					chatroom.append( "<div class='left'> <p class='message'> <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png'/> <b>[" + item.username + "]</b> <font color='gray'> " + hora + "</font> " + item.message + "</p> </div>") 
	// 				}
	// 				else{
	// 					chatroom.append( "<div class='right'> <p class='message'> <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png'/> <b>[" + item.username + "]</b> <font color='gray'> " + hora + "</font>  "+ item.message + "</p> </div>" ) 
	// 				}

	// 				if (item.identificador) getVotosPorIdentificador(item.identificador)
	// 			});
	// 			// $("#loader").attr("style","display:none")

				
	// 			if (aposXItens<=11) {
	// 				var totalWidth = 0;
	// 				$('section#chatroom').children(0).each(function () {
	// 						totalWidth += ( $(this).outerHeight() + 10) //somando o pading de cd elem
	// 				})
					
	// 				//pelas contas faltou 70px
	// 				$("section#chatroom").animate({scrollTop: (totalWidth+70) }, 200)
					
	// 			}


	// 		}
	// 		else{
	// 			 console.log("Nao tem mais mensagens para resgatar, ja está na ultima")
	// 			// $("#loader").attr("style","display:none")
	// 		}

	// 		//$("#loader").attr("style","display:none")
	// 	});

	// 	//somente na primeira vez, que traz até 10 mensagens
		
	// }














	function loadMuralPosts(aposXItens){
		$.ajax({
			url: "loadMuralPosts/"+aposXItens
		}).then(function(data) {
			if (data.length > 0){
				// isso tem q ir pro fim, no fim incremente caso tudo tenha dado certo, somente no final, senao pode dar ruim.
				contadorMuralMensagens+= data.length
				data.forEach(item => { 
					var dt = new Date(item.time);
					const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
					if (item.username == loggeduser.text()){
						chatroom.append( "<div class='left'> <p class='message'> <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png'/> <b>[" + item.username + "]</b> <font color='gray'> " + hora + "</font> " + item.message + "</p> </div>") 
					}
					else{
						chatroom.append( "<div class='right'> <p class='message'> <img class='miniAvatar' src='usersAvatar/"+item.username+"-user-icon.png'/> <b>[" + item.username + "]</b> <font color='gray'> " + hora + "</font>  "+ item.message + "</p> </div>" ) 
					}
					if (item.identificador) getVotosPorIdentificador(item.identificador)
				});
				// $("#loader").attr("style","display:none")
				if (aposXItens<=11) {
					var totalWidth = 0;
					$('section#chatroom').children(0).each(function () {
							totalWidth += ( $(this).outerHeight() + 10) //somando o pading de cd elem
					})
					//pelas contas faltou 70px
					$("section#chatroom").animate({scrollTop: (totalWidth+70) }, 200)
				}
			}
			else{
				 console.log("Nao tem mais mensagens para resgatar, ja está na ultima")
				// $("#loader").attr("style","display:none")
			}
			//$("#loader").attr("style","display:none")
		});
		//somente na primeira vez, que traz até 10 mensagens
	}


















	function getVotosPorIdentificador(identificador){
		$.ajax({
			url: "./getVotosPorIdentificador/"+ identificador
			}).then(function(retorno) {
				var votossim = $("#"+identificador+"_like")
				votossim[0].innerHTML = retorno.votossim
			
				var votosnao = $("#"+identificador+"_dislike")
				votosnao[0].innerHTML = retorno.votosnao
				// console.log("RETORNO para o identificador["+identificador+"] ="+retorno)
			}).fail(function(retorno){
				console.log("deu algum erro ao resgatar a contagem de votos para essa midia")	
				// console.log(retorno)
			})
	}


});



// When page finish loads
document.addEventListener('readystatechange', () => {

	if (document.readyState == 'complete'){
		

		$("#loader").attr("style","display:none")
		
	}

});

