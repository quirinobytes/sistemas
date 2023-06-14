/* LAYOUT SCRIPTS */

$(function () {

    //isso serve para fazer reload ao clicar fora do body
    $("html").click(function () {
        document.getElementById('playSoundOnNewMessage').play();
        setTimeout(() => {
            location.reload(window.location.href);
        }, 500);
    })
    //entao, isso exclui o body de atualizar no click.
    $("body").click(function () {
        event.stopPropagation();
    })


    function scrollToEndOfPage() {

    }

});

function toogleImageFullScreen(elem) {
    // alert("entrei full screen")
    if (elem.className.match(/\bshowImageFullScreen\b/)) {
        elem.classList.add("imgMural");
        elem.classList.remove("showImageFullScreen");
    }
    else {
        elem.classList.add("showImageFullScreen");
        elem.classList.remove("imgMural");
    }
}





