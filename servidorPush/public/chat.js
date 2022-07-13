
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


	$( document ).ready(function() {

		socket.emit('username', {username : loggeduser.text()});

		$.ajax({
			url: "./rest/chat/list"
		}).then(function(data) {
			console.log(data);
			data.forEach(item => chatroom.append("<p class='message'><b>" + item.username + "</b>: " + item.message + "</p>") );	
    });

	//Appending HTML5 Audio Tag in HTML Body
	$('').appendTo('body');

	})



	//Emit message
	send_message.click(function(){
		socket.emit('message', {message : message.val()})

		//limpar o inputbox do message, depois que enviar mensagem
		message.val('');
	})

	//Wait on new_message
	socket.on("message", (data) => {
		//limpar o campo que indica que um usuário está digitando: User is typing a message...
		feedback.html('');
		chatroom.append("<p class='message'><b>" + data.username + "</b>: " + data.message + "</p>")
		//container.animate({ scrollTop: $(document).height() }, 1000)

		//fazer o scroll down a cada mensagem nova.
		container.animate({"scrollTop": $('#chatroom')[0].scrollHeight}, "slow")
		$('body').animate({"scrollTop": $('#chatroom')[0].scrollHeight}, "slow")
		
		//play sound when new message arrives but not in my chat.
		if (data.username != loggeduser.text()){
			console.log(data.username + " | " + loggeduser.text())
		    $('#chatAudio')[0].play();
		}
		
	})

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
});


