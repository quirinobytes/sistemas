
var globalContatosList = [];
var globalAudio;


function loadChatWith(username) {

	var usr = $("#myname");
	myname = usr[0].innerText ;
	loggedUser = usr[0].innerText ;

	var messageTo = $("#divMessageTo")
	var imgContactTo = $("#imgContactTo")
	var cList  = $("#contactList")
	var feedback = $("#feedback")
		//Limpa o board chatroom para carregar as mensagens com o amigo que foi selecionado.
		messageTo.empty();
		feedback.empty();

	imgContactTo.attr("src","usersAvatar/"+username+"-user-icon.png");
	
	//Limpar a lista no div=contacts caso tenha mensagemNaoLida, agora no carregamento. 
	for (cont=0;cont<cList[0].children.length;cont++){
		if (cList[0].children[cont].innerText == username )
			$( cList[0].children[cont]).removeClass("temMensagemNaoLida");
	}

	// console.log ("aqui foi chamado a loadChatWith/"+loggedUser+"/"+username+"/");

	divContato.innerHTML = username;

	$.ajax({
			url: "./rest/loadChatWith/"+myname+"/"+username
	}).then(function(data) {

		if (data)
		data.forEach(item => { 
			// console.log("ITEM:");
			de = item[0].from
			para = item[0].to
			mensagem = item[0].message
			// if (mensagem != undefined)
			if (mensagem)
			  if (para != myname)
			  		messageTo.append("<p class='message'> <img class='miniAvatar' src='usersAvatar/"+de+"-user-icon.png'> <font color='gray'>  " + item[0].time + "</font> <b>[" + de + "]</b> " + mensagem + "</p>") 
		  	  else
				  	messageTo.append("<p class='message' style='text-align:right'> "+ mensagem +" <b>[" + de + "]</b> <font color='gray'>  " + item[0].time + "</font>  <img class='miniAvatar' src='usersAvatar/"+de+"-user-icon.png'> </p>") 
		});
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

	//apagar isso, parece q nao usa
	var contactTo = $("#contactTo")


	var feedback = $("#feedback")
	var loggeduser = $("#loggeduser")
	var container = $("#container")
	var cList  = $("#contactList")
	var pararAudio = $("#pararAudio")
	var gravarAudio = $("#gravarAudio")
	var logged_users = {};
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
		$.ajax(
			{ url: "./consumers"
		}).then(function(obj_consumers) {
				
			usuarios_kong = obj_consumers.data;
			// console.log(usuarios_kong);
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
	
		socket.emit("contactTo", {message : message.val(),from:logged_usr,toContact:divContato.innerText,time:hora})
		//limpar o inputbox do message, depois que enviar mensagem
		message.val('')
		message.attr("rows","1")
	})


	//Emit a username when click on send_username button.
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
		// console.log("chamando a blickLoggedUsers()")
	})
	socket.on('logout', (name) => {
		console.log("desconectando o fulano:"+name)
		usuarioDeslogado(name);
		blinkLoggedUsers();
	})
	socket.on('audio', (media) => {
		// console.log("src"+media.src);
		if (media.src!=""){
				var audio = $("#audioPrivado");      
				$("#audioPrivadoSrc").attr("src", media.src);
				/****************/
				audio[0].pause();
				audio[0].load();//suspends and restores all audio element
			
				//audio[0].play(); changed based on Sprachprofi's comment below
				audio[0].oncanplaythrough = audio[0].play();
		}
	})

	//Wait on new message on channel "contactTo"
	socket.on('contactTo', (data) => {
		
		friendUsername=divContato.innerText
		loggedUser = $("#myname")[0].innerText
			
		//colocar minhas mensagens com a pessoa e for mensagem para mim, no board.
		if (data.toContact == friendUsername && data.from == loggedUser){
			// console.log("to colocando minhas msg no board")
			if (data.from == loggedUser)
				divMessageTo.append("<p class='message'><img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png'><font color='gray'>" + data.time + "</font> <b>[" + data.from + "]</b> " + data.message + "</p>");
			else
				divMessageTo.append("<p class='message' style='text-align:right'>" + data.message + "<b>[" + data.from + "]</b> <font color='gray'>" + data.time + "</font> <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png'> </p>");
		}
		else{ 
			//caso o board do seu contato nao esteja selecionado, e nao seja o seu board
			if (data.toContact == loggedUser && data.from != divContato.innerText){
				// console.log("aqui é a hora do vermelho?")

				//console.log(cList[0])
				//console.log("tamanho= "+cList[0].children.length);
				var cont =0;
				
			    //caso nao estava selecionado o board de mensagens do contato, rastreiar os outros para destacar em vermelho como MENSAGEM NAO LIDA.
				for (cont=0;cont<cList[0].children.length;cont++){
					if (cList[0].children[cont].innerText == data.from ){
						//console.log( "ACHEI: Alterando o div do: " + cList[0].children[cont].innerText);
						$( cList[0].children[cont]).addClass("temMensagemNaoLida");
						$('#playSoundOnNewMessage')[0].play();
					}
				}
			}
		}
		//caso eu esteja com o board de mensagens do amigo selecionada, colocar as mensagens dele pra mim, e soa um bip
		if (data.from == divContato.innerText && data.toContact == loggedUser ){
			// alert("aqui rodou o ultimo if, que coloca as mensagens dos amigos")
			divMessageTo.append("<p class='message' style='text-align:right'>" + data.message +  "<b>[" + data.from + "]</b><font color='gray'>" + data.time + "</font><img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png'></p>");
			$('#playSoundOnNewMessage')[0].play();
			feedback.empty();
		}
	})
	

	gravarAudio.click(function(){
			navigator.mediaDevices.getUserMedia({ audio: true})
			.then(stream => {
				const options = {mimeType: 'audio/webm'};
				mediaRecorder = new MediaRecorder(stream,options)
				mediaRecorder.start()
				chuck = []
				
				mediaRecorder.addEventListener("dataavailable", e => {
					chuck.push(e.data)
				})
		
				mediaRecorder.addEventListener("stop", e => {
					blob = new Blob(chuck,{ type: "audio/ogg"} )
					const data = {
						"name" : "audiofile.ogg",
						"files":  blob,
						"files.File": blob
					  };
					audio_url = URL.createObjectURL(blob)
					audio = new Audio(audio_url)
					audio.setAttribute("controls",1)



					const formData = new FormData();
					formData.append('fname', "blob.ogg");
					formData.append('file', blob, "audio.ogg" );


					$.ajax(
						{ 
							url: "./upload-audio/",
							type: "POST",
							processData: false,
							contentType: false,
							data: formData,
							dataType: 'json',
							// contentType: "application/x-www-form-urlencoded",
							//enctype: "multipart/form-data",
							data: formData // Dont serializes .

						}).then(function(result) {
							console.log(result);
						});
					//console.log(result)
					//socket.emit("audio", {audio:audio, from:"rafael", to:"spitz"})
					//divMessageTo.append(audio)
				})
			
			})
	})

	pararAudio.click(function(){
		mediaRecorder.stop()
	})
});


