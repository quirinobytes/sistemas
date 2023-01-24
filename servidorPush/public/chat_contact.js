
function loadChatWith(username) {

	var usr = $("#myname");
	var messageTo = $("#messageTo");
	var imgContactTo = $("#imgContactTo");
	imgContactTo.attr("src",username+"-user-icon.png");
	//Limpa o board do chat
	console.log ("empty board");
	messageTo.empty();

	divContato.innerHTML = username;

	//mostrar nome do loggedUser
	//console.log(usr[0].innerText);
	
	myname = usr[0].innerText ;
	$.ajax({
			url: "./rest/loadChatWith/"+myname+"/"+username
	}).then(function(data) {
	
		//mostrar as mensagens de retorno
		//console.log(data);

		data.forEach(item => { 
			  var dt = new Date(item.time);
			  const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
			  messageTo.append( "<p class='message'><font color='gray'>  " + hora + "</font> <b>[" + item.username + "]</b> " + item.message + "</p>") 
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

	

	$( document ).ready(function() {
		
		// Aqui estou pegando a lista dos usuários do konga
		$.ajax(
			{ url: "./consumers"
			}).then(function(obj_consumers) {
			
				usuarios_kong = obj_consumers.data;
				//console.log(usuarios_kong);
				usuarios_kong.forEach(item => { 
					if ( item.username != myname[0].innerText )
    					contactList.innerHTML += "<div id='contacts' onclick='loadChatWith(this.innerHTML);'>" + item.username + "</div>";
                });
   		});

	//Appending HTML5 Audio Tag in HTML Body
	$('').appendTo('body');

	})

	

	//Emit message
	send_message.click(function(){
		var logged_usr = myname[0].innerText
		console.log("send_message.click("+message.val()+")");
		console.log("from:myname:")
		console.log(myname);
		socket.emit("contactTo", {message : message.val(),from:logged_usr,toContact:divContato.innerText})

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

	socket.on('contactTo', (data) => {
		var dt = new Date(data.time);
        const hora = dt.toLocaleString("en-us", {hour: '2-digit', minute: '2-digit', second: "2-digit"});
		friendUsername=divContato.innerText;
		var usr = $("#myname");
		loggedUser = usr[0].innerText ;
		console.log("data=");
		console.log(data);
		

	
		//colocar minhas mensagens com a pessoa e for mensagem para mim, no board.
		if (data.toContact == friendUsername && data.from == loggedUser){
			
			//divMessageTo.append(data.message);
			
            divMessageTo.append("[" + data.from +"]" + data.message + "</br> ")
		}
		else{
			if (data.toContact == loggedUser && data.from != divContato.innerText){
				console.log(cList)
				console.log("tamanho= "+cList.children.length);
				var cont =0;
			//caso nao estava no board, rastreiar os outros para destacar como MENSAGEM NAO LIDA.
				for (cont=0;cont<cList.children.length;cont++){
					console.log(cList[0].children[cont] );
					console.log( "from:"+data.from);
				
					if (cList[0].children[cont].innerText == data.from ){
						cList[0].children[cont].innerHTML = data.from + "<b>*</b>";
					}
				}
			}
		}
		//colocar as mensagens da pessoa para mim, no board.
		if (data.from == divContato.innerText){
			divMessageTo.append("["+ data.from +"]" + data.message + "</br> ")
		}
				
		
		
	})
	
});


