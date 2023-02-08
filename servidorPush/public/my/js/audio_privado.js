function gravarAudio(){
    navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream)
          mediaRecorder.start()
          chuck = []
          
          mediaRecorder.addEventListener("dataavailable", e => {
            chuck.push(e.data)
          })

          mediaRecorder.addEventListener("stop", e => {
            blob = new Blob(chuck)
            audio_url = URL.createObjectURL(blob)
            audio = new Audio(audio_url)
            audio.setAttribute("controls",1)
            ok.appendChild(audio)
            
            io.sockets.emit("audio", {from:"rafael", to:"spitz", audio:audio})
          })
          .catch(error => {
            console.log(error)
          })


          //window.localStream = stream;
          //document.querySelector('video').src = URL.createObjectURL(stream);
        })
        .catch((err) => {
          console.log(err);
        });
       
      
      
}


function pararAudio(){
    mediaRecorder.stop()
}

function pararVideo(){
    localStream.getVideoTracks()[0].stop();
}


function gravarVideo(){
    navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        })
        .then(stream => {
          window.localStream = stream;
          document.querySelector('video').src = URL.createObjectURL(stream);
        })
        .catch((err) => {
          console.log(err);
        });
  }


        // gravar.onclick = () => {
    //       window.navigator.getUserMedia({audio:true, video:true})
		// .then(stream => {
		// 	mediaRecorder = new MediaRecorder(stream)
		// 	mediaRecorder.start()
		// 	chuck = []

		// 	mediaRecorder.addEventListener("dataavaiable", e => {
		// 		chuck.push(e.data)
		// 	})

		// 	mediaRecorder.addEventListener("stop", e => {
		// 		blob = new Blob(chuck)
		// 		audio_url = URL.createObjectURL(blob)
		// 		audio = new Audio(audio_url)
		// 		audio.setAttribute("controls",1)
		// 		ok.appendChild(audio)
		// 	})
		// 	.catch(error => {
		// 		console.log(error)
		// 	})
		// })
//}