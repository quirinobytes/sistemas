/* LAYOUT SCRIPTS */

$(function(){

    //isso serve para fazer reload ao clicar fora do body
    $("html").click(function() {
        document.getElementById('playSoundOnNewMessage').play();
        setTimeout(() => {
            location.reload(window.location.href);
        }, 500);
    })
    //entao, isso exclui o body de atualizar no click.
    $("body").click(function() {
        event.stopPropagation();
    })

    
    function scrollToEndOfPage(){
        
    }

});
