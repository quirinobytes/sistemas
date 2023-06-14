var contadorAposNItensPrivateMensagens = 0
var globalContatosList = []
var globalAudio
var telacheia = false
var gravando = false

var contadorAposNItensPrivateMensagensObj = new Map([
	["username", 500],
	["bananas", 300],
	["oranges", 200]
])

function loadChatWith(username, aposNItens) {
	//destacar o usuário que selecionado no: <div id='contactList'>
	// testar uma forma rapida/simple de efetuar a mudança de classe, sem precisar da função addClassSelected
	//$("."+username).addClass("selected")
	addClassSelected(username)


	var usr = $("#myname");
	//myname = usr[0].innerText;
	loggedUser = usr[0].innerText;

	var messageTo = $("#divMessageTo")
	var imgContactTo = $("#imgContactTo")
	var cList = $("#contactList")
	var feedback = $("#feedback")

	//Limpa o board divMessageTo para carregar as mensagens com o amigo que foi selecionado.
	feedback.empty();

	imgContactTo.attr("src", "usersAvatar/" + username + "-user-icon.png");

	divContato.innerHTML = username;
	// if (!contadorAposNItensPrivateMensagensObj.username >= 0)
	// 	contadorAposNItensPrivateMensagensObj.username = 0

	$.ajax({
		url: "./rest/loadChatWith/" + myname + "/" + username + "/" + contadorAposNItensPrivateMensagensObj.get(username)
	}).then(function (data) {

		if (data) {

			contadorAposNItensPrivateMensagensObj.set(username, contadorAposNItensPrivateMensagensObj.get(username) + data.length)

			data.forEach(item => {
				// console.log("ITEM:");
				// console.log(item)
				de = item.from
				para = item.to
				mensagem = item.message
				hora = new Date(item.time).toLocaleString("en-us", { hour: '2-digit', minute: '2-digit', second: "2-digit" });
				// hora = hora.

				// if (mensagem != undefined)
				if (mensagem) {

					if (para == myname)
						//messageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+de+"-user-icon.png' alt='"+de+"'>  <br> "+ mensagem +" </p>") 
						messageTo.prepend("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/" + de + "-user-icon.png' alt='" + de + "'>  <br> " + mensagem + " </p>")
					else
						//messageTo.append("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/"+de+"-user-icon.png' alt='"+de+"'> <font class='horamessagemural' color='gray'>  " + hora + "</font> <br>" + mensagem + "</p>") 
						messageTo.prepend("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/" + de + "-user-icon.png' alt='" + de + "'> <font class='horamessagemural' color='gray'>  " + hora + "</font> <br>" + mensagem + "</p>")
				}
			});
			//ja volta o foco do cursor pro input box de mensagens.
			$("#message").focus()
			//fazer depois mesmo
			$('div.container').scrollTop($('div.container').scrollTop() + 1)
		}
	});



	removeClassTemMensagemNaoLida(username)
}

function auto_height(elem) {
	//elem.style.height = "2"
	elem.attr("rows", 1)

	elem.style.height = (elem.scrollHeight) + "px"
}

function removeClassTemMensagemNaoLida(username) {
	var cList = $("#contactList")
	for (cont = 0; cont < cList[0].children.length; cont++) {
		str = cList[0].children[cont].innerText
		str = str.replace(/(\r\n|\n|\r)/gm, "").trim()
		if (str == username) {
			$(cList[0].children[cont]).children().removeClass("temMensagemNaoLida");
		}
	}
}

function addClassSelected(username) {
	var cList = $("#contactList")
	for (cont = 0; cont < cList[0].children.length; cont++) {
		str = cList[0].children[cont].innerText
		str = str.replace(/(\r\n|\n|\r)/gm, "").trim()
		if (str == username)
			$(cList[0].children[cont]).children().addClass("selected");
		else
			$(cList[0].children[cont]).children().removeClass("selected");
	}
}

function avisoRecebendoWebcallDoAmigo(username) {
	var cList = $("#contactList")
	for (cont = 0; cont < cList[0].children.length; cont++) {
		str = cList[0].children[cont].innerText
		str = str.replace(/(\r\n|\n|\r)/gm, "").trim()
		if (str == username) {
			$('#receivingwebcall_' + username).attr("style", "display:block;height:40px;width:40px")
			$('#receivingwebcall_' + username).attr("src", "../../imagem_comum/webcallreceiving.gif")
		}

	}
}

function removeAvisoRecebendoWebcallDoAmigo() {
	username = divContato.innerText
	var cList = $("#contactList")
	for (cont = 0; cont < cList[0].children.length; cont++) {
		str = cList[0].children[cont].innerText
		str = str.replace(/(\r\n|\n|\r)/gm, "").trim()
		if (str == username) {
			$('#receivingwebcall_' + username).attr("style", "display:none")
			$('#receivingwebcall_' + username).attr("src", "")
		}
	}
}

function maximizaWebcallTelaCheia() {
	var video = $('.remote-video')
	if (!telacheia) {
		video.attr("style", "height:300px; width:300px; margin-top:-160px; margin-left:-340px; display:block; ")
		telacheia = true
	}
	else {
		video.attr("style", "height:140px; width:180px; margin-top:-60px; display:block; padding-bottom:10px")
		telacheia = false
	}
}

function toogleWebcallFullScreen(elem) {
	// alert("ENTREI")
	if (elem.className.match(/\btoogleWebcallFullScreen\b/)) {
		elem.classList.add("videoWebcallInitialConfigScreen")
		//elem.classList.add("remote-video")

		elem.classList.remove("toogleWebcallFullScreen")

	}
	else
		if (elem.className.match(/\btoogleWebcallNormalScreen\b/)) {
			elem.classList.add("toogleWebcallFullScreen")
			elem.classList.remove("toogleWebcallNormalScreen")
		}
		else
			if (elem.className.match(/\bvideoWebcallInitialConfigScreen\b/)) {
				elem.classList.add("toogleWebcallNormalScreen")
				elem.classList.remove("videoWebcallInitialConfigScreen")
				// elem.classList.remove("remote-video")

			}

}


function usuarioLogado(nome) {
	$("#" + nome + "_logged_user").addClass("logged_user")
}

function usuarioDeslogado(nome) {
	$("#" + nome + "_logged_user").removeClass("logged_user")
}

function blinkLoggedUsers() {
	//limpando tudo antes

	globalContatosList.forEach(item => {
		if (item.username != undefined) {
			usuarioDeslogado(item.username)
		}
	})

	$.ajax({
		url: "./logged_users"
	}).then(function (lista) {
		lista.forEach(item => {
			usuarioLogado(item);
		});
	});
}

function limpaBoard(username) {
	//alert("limpando o board do"+username)
	var messageTo = $("#divMessageTo")
	messageTo.empty();

	//reseta o contador de páginas usuário
	contadorAposNItensPrivateMensagensObj.set(username, 0);

	//remover isso, igual ao abaixo.
	let videoEl = document.querySelector('.remote-video');
	//$('.remote-video').get(0).pause();
	//$('.remote-video').get(0).currentTime = 0;
	//$('.remote-video').empty();

	//videoElem = document.getElementById('videoWebcallPlace');
	$('#videoWebcallPlace').get(0).pause();
	$('#videoWebcallPlace').get(0).currentTime = 0;
	$('#videoWebcallPlace').empty();
	$('#videoWebcallPlace').addClass("remote-video")
	//var divWebrtc = $("#divWebrtc")
}



function acceptWebcall(salaID) {

	let videoEl = document.querySelector('.remote-video'); // remover isso e usar somente o de baixo.
	let videoElem = document.querySelector('#videoWebcallPlace');


	let peerIdEl = document.querySelector('#connect-to-peer');
	let peerId = salaID;


	//////////////////$(".remote-video").attr("style", "height: 140px;width: 180px;  display:block;")

	videoElem.classList.add("videoWebcallInitialConfigScreen")
	videoElem.classList.remove("remote-video")

	//$(".remote-video").attr("style", "display:block;")


	//$(".remote-video").attr("style","display:block")

	//onde está meu peerserver
	let peer = new Peer({
		host: 'evolua.antidrone.com.br',
		port: 30443,
		path: '/peerjs/myapp',
		secure: true
	});

	let renderVideo = (stream) => {
		videoEl.srcObject = stream;
	};

	navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		.then((stream) => {
			let call = peer.call(peerId, stream);
			call.on('stream', renderVideo);
			// socket.emit("liveAccepted", {message : peerId })

		})
		.catch((err) => {
			console.log('Failed to get local stream', err);
		});
	removeAvisoRecebendoWebcallDoAmigo()
}


function finishWebcall(salaID) {
	$(".remote-video").attr("style", "height: 0px;width: 0px;")
	$(".remote-video").attr("style", "display:none;")
}


$(function () {
	//make connection direct on web server using relative hosts 
	var socket = io.connect('/', { secure: true, reconnect: true, rejectUnauthorized: false })

	var logged_users = {};

	//buttons and inputs
	var myname = $("#myname")
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var acceptWebcall = $("#acceptWebcall")
	var startWebcallGetRoomid = $("#startWebcallGetRoomid")
	var send_username = $("#send_username")
	var divMessageTo = $("#divMessageTo")
	var contacts = $("#contacts")

	//apagar isso, parece q nao usa
	var contactTo = $("#contactTo")

	var feedback = $("#feedback")
	var loggeduser = $("#loggeduser")
	var container = $("#container")
	var cList = $("#contactList")
	var pararAudio = $("#pararAudio")
	var gravarAudio = $("#gravarAudio")
	var downloadLink = $("#downloadLink")
	var audioPrivado = $("#audioPrivado")
	audioPrivadoSrc = $("#audioPrivadoSrc")

	$(document).ready(function () {

		socket.emit('username', { username: myname[0].innerText });

		$.ajax(
			{
				url: "./logged_users"
			}).then(function (obj) {
				let logged_users = obj;
				// console.log("LOGGED USERS");
				// console.log(logged_users);
			});

		// Aqui estou pegando a lista dos usuários do "konga"
		// o /consumers é um api gateway para dentro do konga na 8001, control plane port
		loadConsumers()



		$('div.container').on('scroll', function () {
			to = divContato.innerHTML
			//quando o scroll chegar no inicio da pagina
			if ($(this).scrollTop() <= 0) {
				console.log("SUBINDO CORRETAMENTE: contadorAposNItensPrivateMensagensObj[" + to + "]= " + contadorAposNItensPrivateMensagensObj[to])
				loadChatWith(to, contadorAposNItensPrivateMensagensObj[to])
			}
			//quando o scroll chegar no final da pagina
			if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 1) {
				//console.log("APOS CARREGAR CORRETAMENTE: contadorAposNItensPrivateMensagensObj["+to+"]= "+contadorAposNItensPrivateMensagensObj[to])

				//loadChatWith(to, contadorAposNItensPrivateMensagensObj[to])
			}
		})

		//Appending HTML5 Audio Tag in HTML Body
		$('').appendTo('body');

	})


	//toda vez q clica no friend, carrega a loadconsumers
	function loadConsumers() {
		$.ajax(
			{
				url: "./consumers"
			}).then(function (obj_consumers) {
				usuarios_kong = obj_consumers.data;
				// console.log(usuarios_kong);

				//salvando na variavel global para usar no blinkLoggedUsers
				globalContatosList = usuarios_kong;
				usuarios_kong.forEach(item => {
					//fazer isso para remover o nome do usuario logado e nao mostrar na lista de contatos, pois ele tmb esta na lista e nao faz sentido ele falar com ele.
					if (item.username != myname[0].innerText) {
						username = item.username
						contadorAposNItensPrivateMensagensObj.set(username, 0)
						console.log("contadorAposNItensPrivateMensagensObj.get(" + username + ")=" + contadorAposNItensPrivateMensagensObj.get(username))
						contactList.innerHTML += "<div onclick='limpaBoard(\"" + item.username + "\"); loadChatWith(\"" + item.username + "\"," + contadorAposNItensPrivateMensagensObj.get(username) + ");'>   <div id='contactLine' class='" + item.username + "'>  <img class='avatarContactList' src='usersAvatar/" + item.username + "-user-icon.png' alt='" + item.username + "'> <div id='" + item.username + "_logged_user' ></div> &nbsp; <div id='contacts' >" + item.username + "</div> <img style='display:none; height:40px; width:40px' id='receivingwebcall_" + item.username + "' src=''> </div>  </div>";
					}
				});

				//por fim deixar os usuarios logados com a bolinha verde.
				blinkLoggedUsers();
			});
	}

	function logaInicioDaWebCall(from, to) {
		$.ajax(
			{
				url: "https://evolua.antidrone.com.br:30443/chamandoconf/" + from + "/" + to,
				type: "GET",
				processData: false,
				contentType: false,
				// contentType: "application/x-www-form-urlencoded",
				//enctype: "multipart/form-data",
			}).then(function (result) {
				console.log(new Date())
				console.log(from + " chamando webcall com " + to)
			});
	}

	startWebcallGetRoomid.click(function () {
		var peerId
		let videoEl = document.querySelector('.remote-video');
		let videoElem = document.querySelector('#videoWebcallPlace');
		let peerIdEl = document.querySelector('#connect-to-peer');

		//$(".remote-video").attr("style", "height: 130px;width: 170px; display:block;")
		videoElem.classList.add("videoWebcallInitialConfigScreen")
		videoElem.classList.remove("remote-video")


		let renderVideo = (stream) => {
			videoElem.srcObject = stream;
		};

		// Register with the peer server
		let peer = new Peer({
			host: 'evolua.antidrone.com.br',
			port: 30443,
			path: '/peerjs/myapp',
			secure: true
		});
		peer.on('open', (peerId) => {
			peerId = peerId
			console.log("Webcall aceita ID: " + peerId);
			var logged_usr = myname[0].innerText
			socket.emit("live", { message: peerId, from: logged_usr, toContact: divContato.innerText, time: new Date() })
			// socket.emit("offerLive", {message : "<img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> " + loggedUser + " ligando... <br> <img style='display:block; height:30px; width:30px' src='imagem_comum/webcallreceiving.gif'>" +  logged_usr + "<br>   <button id='acceptWebcall' onclick='acceptWebcall(\""+peerId+"\")'> Aceitar  </button> x <button> Rejeitar </button> " ,from:logged_usr,toContact:divContato.innerText,time:new Date()})
			socket.emit("offerLive", { message: "" + logged_usr + " <br>   <button id='acceptWebcall' style='background-color:inherit' onclick='acceptWebcall(\"" + peerId + "\")'>   <img style='background-color:inherit' src='imagem_comum/button-aceitar-webcall.png'>  </button> x <button id='btn_rejectWebcall' style='background-color:inherit' onclick='rejectWebcall(\"" + peerId + "\")'> <img style='background-color:inherit' src='imagem_comum/button-rejeitar-webcall.png'> </button> ", from: logged_usr, toContact: divContato.innerText, time: new Date() })

			//para aparecer no log do peerserver quem está iniciando a chamada.
			logaInicioDaWebCall(logged_usr, divContato.innerText)

			//logMessage(id);
			peerIdEl.value = peerId
		});
		peer.on('error', (error) => {
			console.error(error);
		});

		// Handle incoming data connection
		peer.on('connection', (conn) => {
			console.log('incoming peer connection!');
			conn.on('data', (data) => {
				console.log(`received: ${data}`);
			});
			conn.on('open', () => {
				conn.send('hello!');
			});
		});

		// Handle incoming voice/video connection
		peer.on('call', (call) => {
			navigator.mediaDevices.getUserMedia({ video: true, audio: true })
				.then((stream) => {
					call.answer(stream); // Answer the call with an A/V stream.
					call.on('stream', renderVideo);
				})
				.catch((err) => {
					console.error('Failed to get local stream', err);
				});
		});

		let conn = peer.connect(peerId);
		// conn.on('data', (data) => {
		//   logMessage(`received: ${data}`);
		// });
		conn.on('open', () => {
			conn.send('hi!');
		});

		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				let call = peer.call(peerId, stream);
				call.on('stream', renderVideo);
			})
			.catch((err) => {
				logMessage('Failed to get local stream', err);
			});
	})

	// //Wait on new message on channel "live"
	// socket.on('live', (data) => {
	// 	to = data.toContact
	// 	friendUsername=divContato.innerText
	// 	loggedUser = $("#myname")[0].innerText

	// 	//GATAO no divMessageTo, o certo seria trocar tudo por peerIdEL
	// 	let peerIdEl = document.querySelector('#connect-to-peer');
	// 	let videoEl = document.querySelector('.remote-video');


	// 	console.log("##WEBRTC## [data] = ")
	// 	console.log(data)

	// 	hora = new Date(data.time).toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});

	// 	//colocar minhas mensagens com a pessoa e for mensagem para mim, no board.

	// 	if (data.from == friendUsername && data.toContact == loggedUser){
	// 		contadorAposNItensPrivateMensagensObj.set(to, contadorAposNItensPrivateMensagensObj.get(to) + 1)



	// 	}
	// 	else{ 

	// 		//caso o board do seu contato nao esteja selecionado, e nao seja o seu board
	// 		if (data.toContact == loggedUser && data.from != divContato.innerText){
	// 			//console.log("tem alguem me chamando?")
	// 			avisoRecebendoWebcallDoAmigo(data.from)
	// 			$('#playSoundOnReceivingWebcall')[0].play();
	// 		}
	// 	}

	// 	// caso a webcall seja pro usuário logado, mas ele nao está com o board do friend aberto, colocar um icone de video no friend piscando.
	// 	// if (data.from != divContato.innerText && data.toContact == loggedUser ){
	// 	// 	// alert("aqui rodou o ultimo if, que coloca as mensagens dos amigos")
	// 	// 	//divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> "+ data.message +" </p>");
	// 	// 	//contadorAposNItensPrivateMensagensObj.set(data.from, contadorAposNItensPrivateMensagensObj.get(data.from) + 1)
	// 	// }
	// 	})






	//Send message
	send_message.click(function () {
		if (divContato.innerText == "") {
			alert("selecione um contato para enviar mensagens")
			message.val('')
			message.attr("rows", "1")
		}
		else {
			var logged_usr = myname[0].innerText
			socket.emit("contactTo", { message: message.val(), from: logged_usr, toContact: divContato.innerText, time: new Date() })
			//limpar o inputbox do message, depois que enviar mensagem
			message.val('')
			message.attr("rows", "1")
		}
	})


	//Register new username when click on send_username button.
	send_username.click(function () {
		socket.emit('username', { username: username.val() })
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing', { from: $("#myname")[0].innerText, to: $("#divContato")[0].textContent })
	})

	//Listen on typing
	socket.on('typing', (data) => {
		if (data.from == $("#divContato")[0].textContent && data.to == loggedUser) {
			feedback.html("<p><i>is typing ... </i></p>")
			feedback.fadeIn(500);
			feedback.attr("style", "color:orange; font-weight:bold;")
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
		contatoSelecionado = divContato.innerText
		loggedUser = $("#myname")[0].innerText


		if (data.to == loggedUser && data.src != "" && data.from == contatoSelecionado) {
			data.time = new Date(data.time).toLocaleString("en-us", { hour: '2-digit', minute: '2-digit', second: "2-digit" });
			var audiotag = "<audio preload='auto' src='" + data.audiosrc + "' controls='1'></audio>"
			var message = "<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>" + data.time + "</font>  <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png'>  <br> " + audiotag + " </p>"
			//divMessageTo.append(message)
			divMessageTo.prepend(message)
		}
		if (data.from == loggedUser && data.src != "" && data.to == contatoSelecionado) {
			data.time = new Date(data.time).toLocaleString("en-us", { hour: '2-digit', minute: '2-digit', second: "2-digit" });
			var audiotag = "<audio preload='auto' src='" + data.audiosrc + "' controls='1'></audio>"
			var message = "<p class='messageTo' style='text-align:left;margin-right:auto'> <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png'> <font class='horamessagemural' color='gray'>" + data.time + "</font>    <br> " + audiotag + " </p>"
			//divMessageTo.append(message)
			divMessageTo.prepend(message)
		}
	})

	//Wait on new message on channel "contactTo"
	socket.on('contactTo', (data) => {
		to = data.toContact
		friendUsername = divContato.innerText
		loggedUser = $("#myname")[0].innerText
		hora = new Date(data.time).toLocaleString("en-us", { hour: '2-digit', minute: '2-digit', second: "2-digit" });

		//colocar minhas mensagens com a pessoa e for mensagem para mim, no board.
		if (data.toContact == friendUsername && data.from == loggedUser) {

			// contadorAposNItensPrivateMensagensObj[to] += 1
			contadorAposNItensPrivateMensagensObj.set(to, contadorAposNItensPrivateMensagensObj.get(to) + 1)

			// console.log("#sockert.on## contadorAposNItensPrivateMensagensObj[to]="+contadorAposNItensPrivateMensagensObj[to])


			if (data.from == loggedUser)
				//divMessageTo.append("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'> <font class='horamessagemural' color='gray'>  " + hora + "</font> <br>" + data.message + "</p>")
				divMessageTo.prepend("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png' alt='" + data.from + "'> <font class='horamessagemural' color='gray'>  " + hora + "</font> <br>" + data.message + "</p>")
			else
				// divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> "+ data.message +" </p>");
				divMessageTo.prepend("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png' alt='" + data.from + "'>  <br> " + data.message + " </p>");
		}
		else {
			//caso o board do seu contato nao esteja selecionado, e nao seja o seu board
			if (data.toContact == loggedUser && data.from != divContato.innerText) {
				// console.log("aqui é a hora do vermelho? \n data.from='"+data.from+"' \n tamanho do count=" + cList[0].children.length)
				var cont = 0;
				//caso nao estava selecionado o board de mensagens do contato, rastreiar os outros para destacar em vermelho como MENSAGEM NAO LIDA.
				for (cont = 0; cont < cList[0].children.length; cont++) {
					str = cList[0].children[cont].children[0].innerText
					str = str.replace(/(\r\n|\n|\r)/gm, "").trim()
					console.log("VERIFICANDO SE tem algum igual\n data.from='" + data.from + "' cList[0].children[cont].children[0].innerTex='" + str + "' \n tamanho do count=" + cList[0].children.length)
					console.log("cList[0].children[cont].children[0].innerText = ")
					console.log("[" + str + "]")


					if (str == data.from) {
						console.log("BINGO=" + data.from)

						quemMandouMensagem = $(cList[0].children[cont].children[0])
						quemMandouMensagem.fadeOut(500);
						quemMandouMensagem.addClass("temMensagemNaoLida");
						quemMandouMensagem.fadeIn(500);

						$('#playSoundOnNewMessage')[0].loop = true
						setTimeout(() => $('#playSoundOnNewMessage')[0].loop = false, (2142 * (1)));
						$('#playSoundOnNewMessage')[0].play();

					}
				}
			}
		}
		//caso eu esteja com o board de mensagens do amigo selecionada, colocar as mensagens dele pra mim, e soa um bip
		if (data.from == divContato.innerText && data.toContact == loggedUser) {
			// alert("aqui rodou o ultimo if, que coloca as mensagens dos amigos")
			//divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> "+ data.message +" </p>");
			divMessageTo.prepend("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png' alt='" + data.from + "'>  <br> " + data.message + " </p>");
			$('#playSoundOnNewMessage')[0].play();
			feedback.empty();
			// incContadorAposNItensPrivateMensagensObj(data.from)
			contadorAposNItensPrivateMensagensObj.set(data.from, contadorAposNItensPrivateMensagensObj.get(data.from) + 1)

			// to = data.from
			// contadorAposNItensPrivateMensagensObj.to += 1
			// console.log('to='+to)
			// console.log("#sockert.on## contadorAposNItensPrivateMensagensObj.to="+contadorAposNItensPrivateMensagensObj.to)

		}
	})


	//Wait on new message on channel "contactTo"
	socket.on('offerLive', (data, peerId) => {
		to = data.toContact
		friendUsername = divContato.innerText
		loggedUser = $("#myname")[0].innerText
		hora = new Date(data.time).toLocaleString("en-us", { hour: '2-digit', minute: '2-digit', second: "2-digit" });

		//colocar minhas mensagens com a pessoa e forem as minhas mensagens, poe no board.
		if (data.toContact == friendUsername && data.from == loggedUser) {

			// contadorAposNItensPrivateMensagensObj[to] += 1
			contadorAposNItensPrivateMensagensObj.set(to, contadorAposNItensPrivateMensagensObj.get(to) + 1)

			if (data.from == loggedUser)
				// divMessageTo.append("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'> <font class='horamessagemural' color='gray'>  " + hora + "</font> <br> <img style='display:block; height:30px; width:30px' src='imagem_comum/webcallreceiving.gif'> " + loggedUser + " ligando... <br> <button> Cancelar </button>  </p>")
				divMessageTo.prepend("<p class='messageTo'> <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png' alt='" + data.from + "'> <font class='horamessagemural' color='gray'>  " + hora + "</font> <br> <img style='display:block; height:30px; width:30px' src='imagem_comum/webcallreceiving.gif'> " + loggedUser + " ligando... <br> <button> Cancelar </button>  </p>")
			else
				//divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br> " + loggedUser + " ligando... <br> <img style='display:block; height:30px; width:30px' src='imagem_comum/webcallreceiving.gif'> <button id='acceptWebcall' onclick='acceptWebcall(\""+peerId+"\")'> Aceitar  </button> x <button> Rejeitar </button> </p>");
				divMessageTo.prepend("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png' alt='" + data.from + "'>  <br> " + loggedUser + " ligando... <br> <img style='display:block; height:30px; width:30px' src='imagem_comum/webcallreceiving.gif'> <button id='acceptWebcall' onclick='acceptWebcall(\"" + peerId + "\")'> Aceitar  </button> x <button> Rejeitar </button> </p>");
		}
		else {
			//caso o board do seu contato nao esteja selecionado, e nao seja o seu board
			if (data.toContact == loggedUser && data.from != divContato.innerText) {
				avisoRecebendoWebcallDoAmigo(data.from)
				$('#playSoundOnReceivingWebcall')[0].play();
			}
		}
		//caso eu esteja com o board de mensagens do amigo selecionada, colocar as mensagens dele pra mim, e soa um bip
		if (data.from == divContato.innerText && data.toContact == loggedUser) {
			// alert("aqui rodou o ultimo if, que coloca as mensagens dos amigos")
			//divMessageTo.append("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/"+data.from+"-user-icon.png' alt='"+data.from+"'>  <br>  "+ data.message +" </p>");
			divMessageTo.prepend("<p class='messageTo' style='text-align:right;margin-left:auto'><font class='horamessagemural' color='gray'>  " + hora + "</font>  <img class='miniAvatar' src='usersAvatar/" + data.from + "-user-icon.png' alt='" + data.from + "'>  <br>  " + data.message + " </p>");

			avisoRecebendoWebcallDoAmigo(data.from)
			$('#playSoundOnReceivingWebcall')[0].play();

			contadorAposNItensPrivateMensagensObj.set(data.from, contadorAposNItensPrivateMensagensObj.get(data.from) + 1)
		}
	})

	socket.on('liveAccepted', (peerId) => {
		// console.log("desconectando o fulano:"+name)
		alert(peerId)
	})

	gravarAudio.click(function (from,) {
		if (gravando) {
			if (divContato.innerText == "") return
			mediaRecorder.stop()
			gravando = false
			$("#imgGravarAudio").attr("src", "imagem_comum/button-gravar-audio.png")
			return
		}

		if (divContato.innerText == "") {
			alert("Selecione um contato para enviar audios")
			message.val('')
			message.attr("rows", "2")
		}
		else {
			$("#imgGravarAudio").attr("src", "imagem_comum/button-stop-and-send-audio.png")
			gravando = true


			navigator.mediaDevices.getUserMedia({ audio: true })
				.then(stream => {

					const options = { mimeType: 'audio/webm' };
					mediaRecorder = new MediaRecorder(stream, options)
					mediaRecorder.start()
					chuck = []

					//aqui tá gravando o audio, enquantou ouver dado disponivel
					mediaRecorder.addEventListener("dataavailable", e => {
						chuck.push(e.data)
					})

					mediaRecorder.addEventListener("stop", e => {
						blob = new Blob(chuck, { type: "audio/ogg" })

						audio_url = URL.createObjectURL(blob)
						audio = new Audio(audio_url)
						audio.setAttribute("controls", 1)

						const formData = new FormData()
						formData.append('fname', "blob.ogg")
						formData.append('file', blob, "audio.ogg")
						formData.append('from', myname[0].innerText)
						formData.append('to', divContato.innerText)

						console.log("myname[0].innerText" + myname[0].innerText)

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

							}).then(function (result) {
								// console.log(result);
							});

						// socket.emit("contactTo", data)
						//socket.emit("audio", {audio:audio, from:"rafael", to:"spitz", time:})
						//divMessageTo.append(audio)
					})

				})

		}
	})

	pararAudio.click(function () {
		if (divContato.innerText == "") return
		mediaRecorder.stop()
	})
});


