/* LAYOUT SCRIPTS */

$(function(){

    //isso serve para fazer reload ao clicar fora do body
    $("html").click(function() {
        location.reload(window.location.href);
    })
    $("body").click(function() {
        event.stopPropagation();
    })

});