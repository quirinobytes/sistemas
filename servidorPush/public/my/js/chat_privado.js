
var globalContatosList = [];
var globalAudio;
var contadorAposNItensPrivateMensagens = 0
var contadorAposNItensPrivateMensagensObj = {}


function loadChatWith(username, aposNItens) {
	
	

	console.log("contadorAposNItensPrivateMensagensObj."+username+"= "+contadorAposNItensPrivateMensagensObj.username)
	// if (!contadorAposNItensPrivateMensagensObj.username){
	// 	contadorAposNItensPrivateMensagensObj.username += 10
	// 	console.log("ZEREI O CONTATOR DO "+username)
	// }
	// else{
		//Nao sei se tem q fazer isso, acho q sim
		//contadorAposNItensPrivateMensagensObj = {}
		console.log("CONTADOR CARREGANDO CORRETAMENTE: contadorAposNItensPrivateMensagensObj."+username+"= "+contadorAposNItensPrivateMensagensObj.username)
		// contadorAposNItensPrivateMensagensObj.username += aposNItens

	// }


	$("."+username).addClass("selected")

	var usr = $("#myname");
	myname = usr[0].innerText;
	loggedUser = usr[0].innerText ;

	var messageTo = $("#divMessageTo")
	var imgContactTo = $("#imgContactTo")
	var cList  = $("#contactList")
	var feedback = $("#feedback")
		//Limpa o board divMessageTo para carregar as mensagens com o amigo que foi selecionado.
		
		feedback.empty();

	imgContactTo.attr("src","usersAvatar/"+username+"-user-icon.png");
	
	//Limpar a lista no div=contacts caso tenha mensagemNaoLida, agora no carregamento. 
	for (cont=0;cont<cList[0].children.length;cont++){
		if (cList[0].children[cont].innerText == username )
			$( cList[0].children[cont]).removeClass("temMensagemNaoLida");
	}

	// console.log ("aqui foi chamado a loadChatWith/"+loggedUser+"/"+username+"/");

	divContato.innerHTML = username;
	// if (!contadorAposNItensPrivateMensagensObj.username >= 0)
	// 	contadorAposNItensPrivateMensagensObj.username = 0

	$.ajax({
			url: "./rest/loadChatWith/"+myname+"/"+username+"/"+ contadorAposNItensPrivateMensagensObj.username
	}).then(function(data) {

	if (data){

		contadorAposNItensPrivateMensagensObj.username += data.length

		data.forEach(item => { 
		    // console.log("ITEM:");
			console.log(item)
			de = item.from
			para = item.to
			mensagem = item.message
			hora = new Date(item.time).toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
			// hora = hora.

			// if (mensagem != undefined)
			if (mensagem){
				if (para == myname)
					messageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+de+"-user-icon.png' alt='"+de+"'>  <br> "+ mensagem +" </p>") 
		  	  	else
		  			messageTo.append("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/"+de+"-user-icon.png' alt='"+de+"'> <font color='gray'>  " + hora + "</font> <br>" + mensagem + "</p>") 
			}
		});
	}
    });
} 

function auto_height(elem) {
	elem.style.height = "1px"
	elem.style.height = (elem.scrollHeight) + "px"
}
function removeClassTemMensagemNaoLida(username){
	$("#contacts:contains("+username+")").removeClass("temMensagemNaoLida")
}
function usuarioLogado(nome){
	$("#"+nome+"_logged_user").addClass("logged_user")
}
function usuarioDeslogado(nome){
	$("#"+nome+"_logged_user").removeClass("logged_user")
}
function blinkLoggedUsers(){
	//limpando tudo antes
	globalContatosList.forEach( item => {
		if (item.username != undefined ) {
			usuarioDeslogado(item.username)
		}
	})

	$.ajax({ 
		url: "./logged_users"
	}).then(function(lista) {
		lista.forEach(item =>{
			usuarioLogado(item);
		});
	});
}

function limpaBoard(username) {
	var messageTo = $("#divMessageTo")
	alert("limpando o board do"+username)
	contadorAposNItensPrivateMensagensObj.username = 0;
	messageTo.empty();
}


$(function(){
   	//make connection direct on web server using relative hosts 
	var socket = io.connect('/', { secure: true, reconnect: true, rejectUnauthorized : false })

	var logged_users = {};

	//buttons and inputs
	var myname = $("#myname")
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var divMessageTo = $("#divMessageTo")
	var contacts = $("#contacts")

	//apagar isso, parece q nao usa
	var contactTo = $("#contactTo")

	var feedback = $("#feedback")
	var loggeduser = $("#loggeduser")
	var container = $("#container")
	var cList  = $("#contactList")
	var pararAudio = $("#pararAudio")
	var gravarAudio = $("#gravarAudio")
	var downloadLink = $("#downloadLink")
	var audioPrivado = $("#audioPrivado")
	audioPrivadoSrc = $("#audioPrivadoSrc")
	
	$( document ).ready(function() {

		socket.emit('username', {username : myname.text()});

		$.ajax(
			{ url: "./logged_users"
		}).then(function(obj) {
				let logged_users = obj;
				// console.log("LOGGED USERS");
				// console.log(logged_users);
		});
		
		// Aqui estou pegando a lista dos usuários do "konga"
		// o /consumers é um api gateway para dentro do konga na 8001, control plane port
		loadConsumers()

		$('div.container').on('scroll', function() {
			if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
				console.log("APOS CARREGAR CORRETAMENTE: contadorAposNItensPrivateMensagensObj."+username+"= "+contadorAposNItensPrivateMensagensObj.username)
				
				loadChatWith(username, contadorAposNItensPrivateMensagensObj.username)
			}
		})

		//Appending HTML5 Audio Tag in HTML Body
		$('').appendTo('body');

	})
	
	function loadConsumers(){
		$.ajax(
			{ url: "./consumers"
		}).then(function(obj_consumers) {
				
			usuarios_kong = obj_consumers.data;
			// console.log(usuarios_kong);

			//salvando na variavel global para usar no blinkLoggedUsers
			globalContatosList = usuarios_kong;

			usuarios_kong.forEach(item => { 
					//fazer isso para remover o nome do usuario logado e nao mostrar na lista de contatos, pois ele tmb esta na lista e nao faz sentido ele falar com ele.
					if ( item.username != myname[0].innerText ){
						username = item.username
						contadorAposNItensPrivateMensagensObj.username = 0
						console.log("contadorAposNItensPrivateMensagensObj."+username+"="+contadorAposNItensPrivateMensagensObj.username)
						contactList.innerHTML += "<div id='contactLine' class='"+item.username+"'> <div id='contacts' onclick='limpaBoard(\""+item.username+"\"); loadChatWith(this.innerHTML,"+contadorAposNItensPrivateMensagensObj.username+");'>" + item.username + "</div> <div id='"+item.username+"_logged_user' ></div> </div>";
					}
			});

		//por fim deixar os usuarios logados com a bolinha verde.
		blinkLoggedUsers();
		});


	}


	//Send message
	send_message.click(function(){
		if (divContato.innerText == "") { 
			alert("selecione um contato para enviar mensagens")
			message.val('')
			message.attr("rows","1")
		}
		else{
			var logged_usr = myname[0].innerText
			socket.emit("contactTo", {message : message.val(),from:logged_usr,toContact:divContato.innerText,time:new Date()})
			//limpar o inputbox do message, depois que enviar mensagem
			message.val('')
			message.attr("rows","1")
		}
	})


	//Register new username when click on send_username button.
	send_username.click(function(){
		socket.emit('username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing', {from: $("#myname")[0].innerText, to:$("#divContato")[0].textContent} )
	})

	//Listen on typing
	socket.on('typing', (data) => {
		if (data.from == $("#divContato")[0].textContent && data.to == loggedUser){
			feedback.html("<p><i>is typing ... </i></p>")
			feedback.fadeIn(500);
			feedback.attr("style","color:orange; font-weight:bold;")
			feedback.fadeOut(500);
		}
	})

	socket.on('newlogin', (data) => {
		blinkLoggedUsers();
		// console.log("chamando a blinkLoggedUsers()")
	})

	socket.on('logout', (name) => {
		// console.log("desconectando o fulano:"+name)
		usuarioDeslogado(name);
		blinkLoggedUsers();
	})

	socket.on('audioTo', (data) => {
		contatoSelecionado=divContato.innerText

		if (data.to == myname.text() && data.src!="" && data.from == contatoSelecionado){
				data.time = new Date(data.time).toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
				var audiotag = "<audio preload='auto' src='"+data.audiosrc+"' controls='1'></audio>"
				var message = "<p class='messageTo' style='text-align:right;margin-left:auto'><font color='gray'>" + data.time + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png'>  <br> "+ audiotag + " </p>"
				divMessageTo.append(message)
		}
		if (data.from == myname.text() && data.src!="" && data.to == contatoSelecionado){
				data.time = new Date(data.time).toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
				var audiotag = "<audio preload='auto' src='"+data.audiosrc+"' controls='1'></audio>"
				var message = "<p class='messageTo' style='text-align:left;margin-right:auto'><font color='gray'>" + data.time + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png'>  <br> "+ audiotag + " </p>"
				divMessageTo.append(message)
		}
	})

	//Wait on new message on channel "contactTo"
	socket.on('contactTo', (data) => {

		friendUsername=divContato.innerText
		loggedUser = $("#myname")[0].innerText
		hora = new Date(data.time).toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
			
		//colocar minhas mensagens com a pessoa e for mensagem para mim, no board.
		if (data.toContact == friendUsername && data.from == loggedUser){
			if (data.from == loggedUser)
				divMessageTo.append("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'> <font color='gray'>  " + hora + "</font> <br>" + data.message + "</p>")
			else
				divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> "+ data.message +" </p>");
		}
		else{ 
			//caso o board do seu contato nao esteja selecionado, e nao seja o seu board
			if (data.toContact == loggedUser && data.from != divContato.innerText){
				// console.log("aqui é a hora do vermelho?")
				var cont =0;
			    //caso nao estava selecionado o board de mensagens do contato, rastreiar os outros para destacar em vermelho como MENSAGEM NAO LIDA.
				for (cont=0;cont<cList[0].children.length;cont++){
					if (cList[0].children[cont].innerText == data.from ){
						//console.log( "ACHEI: Alterando o div do: " + cList[0].children[cont].innerText);
						quemMandouMensagem = $( cList[0].children[cont])
						quemMandouMensagem.fadeOut(500);
						quemMandouMensagem.addClass("temMensagemNaoLida");
						quemMandouMensagem.fadeIn(500);
						$('#playSoundOnNewMessage')[0].play();
					}
				}
			}
			
		}
		//caso eu esteja com o board de mensagens do amigo selecionada, colocar as mensagens dele pra mim, e soa um bip
		if (data.from == divContato.innerText && data.toContact == loggedUser ){
			// alert("aqui rodou o ultimo if, que coloca as mensagens dos amigos")
			divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> "+ data.message +" </p>");
			$('#playSoundOnNewMessage')[0].play();
			feedback.empty();
		}
	})
	

	gravarAudio.click(function(from,){
		
		if (divContato.innerText == "") { 
			alert("Selecione um contato para enviar audios")
			message.val('')
			message.attr("rows","1")
		}
		else{

			navigator.mediaDevices.getUserMedia({ audio: true})
			.then(stream => {
				
				const options = {mimeType: 'audio/webm'};
				mediaRecorder = new MediaRecorder(stream,options)
				mediaRecorder.start()
				chuck = []
				
				//aqui tá gravando o audio, enquantou ouver dado disponivel
				mediaRecorder.addEventListener("dataavailable", e => {
					chuck.push(e.data)
				})
		
				mediaRecorder.addEventListener("stop", e => {
					blob = new Blob(chuck,{ type: "audio/ogg"} )
					
					audio_url = URL.createObjectURL(blob)
					audio = new Audio(audio_url)
					audio.setAttribute("controls",1)

					const formData = new FormData()
					formData.append('fname', "blob.ogg")
					formData.append('file', blob, "audio.ogg" )
					formData.append('from',myname.text())
					formData.append('to',divContato.innerText)
					
					$.ajax(
						{ 
							url: "./post-audio/",
							type: "POST",
							processData: false,
							contentType: false,
							data: formData,
							dataType: 'json',
							// contentType: "application/x-www-form-urlencoded",
							//enctype: "multipart/form-data",
							data: formData // Dont serializes .

						}).then(function(result) {
							// console.log(result);
						});
						
						// socket.emit("contactTo", data)
					//socket.emit("audio", {audio:audio, from:"rafael", to:"spitz", time:})
					//divMessageTo.append(audio)
				})
			
			})

		}
	})

	pararAudio.click(function(){
		if (divContato.innerText == "") return
		mediaRecorder.stop()
	})
});


