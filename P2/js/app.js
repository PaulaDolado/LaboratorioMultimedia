/*
* APLICACIÓ
*/

$(document).ready(function() {
    startIntro();
    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");
    let nivell = 0;

    const ranking = new Ranking($("#leaderboard"), $(".ranking-wrap"), $("#ranking"));
    ranking.carregarPuntuacions();

    $("#dificultadBtn").click(function() {
        $("#menu").hide();
        $("#joc").show();
        joc = new Joc(myCanvas, ctx, nivell, ranking);
        joc.inicialitza();
        animacio();
    });

    divJoc = $("#joc");
    $("#facil").click(function() {
        nivell = 0;
    });
    $("#medio").click(function() {
        nivell = 1;
    });
    $("#dificil").click(function() {
        nivell = 2;

    });



});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);    
}

function reproducirEfecto(nombre) {
    let soundEvent = new CustomEvent("playEffect", {
        detail: {
            name: nombre
        }
    });
    document.dispatchEvent(soundEvent);
}


function startIntro() {
    var intro = introJs();
    $('#ayuda').click(function(){
    intro.setOptions({
        steps: [
            {
                element: '#contenidoMenu',
                intro: "¡Bienvenidos a BreakOut, el juego de destruir bloques! " 
            },
            {
                element: '#facil',
                intro: "El nivel fácil presenta unos bloques más débiles. "
            },
            {
                element: '#medio',
                intro: "El nivel medio presenta unos bloques más complicados de romper. "
            },
            {
                element: '#dificil',
                intro: "¡Este nivel es tan solo para los mejores! Contiene los bloques más difíciles de romper. "
            },
            {
                element: '#leaderboard',
                intro: "Aquí se guardarán todas las máximas puntuaciones registradas. "
            },
            {
                element: '.music-controls',
                intro: "Aquí se encuentra el reproductor de música"
            },
            {
                element: '#mc-mute',
                intro: "Si desea activar/desactivar la música y efectos de sonido general, presione este botón inferior. "
            }
            

        ],
        nextLabel: 'Siguiente',
        prevLabel: 'Anterior',
        skipLabel: 'x',
        doneLabel: 'Hecho',
        exitOnOverlayClick: true,
        showProgress: true,
        showBullets: false,
        disableInteraction: true,
        
    })
    intro.start();
});
}
