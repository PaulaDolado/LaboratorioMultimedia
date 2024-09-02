/*
* CLASSE JOC
*/

class Joc{
    constructor(canvas, ctx, nivell, ranking) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;
        this.totxoamplada = 22;
        this.totxoalcada = 10;
        this.totxocolor = 20;
        this.velocitat = 1;
        this.totxosTotals = 0;
        this.totxosTrencats = 0;
        this.vides = 3;
        this.gameover = false;
        this.gameoverOpened = false;
        this.punts = 0;
        this.vidaAddicional = false;

        this.ranking = ranking;

        this.bola = new Bola(new Punt(this.canvas.width/2,this.canvas.height - 100), 7);
        this.pala = new Pala(new Punt((this.canvas.width/2) - 60,this.canvas.height-15),120,10);
        this.mur = new Mur(nivell, this.canvas.width ,this.canvas.height);
        this.mur.generaMur();
        this.totxosTotals = this.mur.generarTotxos.length;

        this.key = {
            LEFT: {code:37, pressed:false},
            RIGHT: {code:39, pressed:false}
        };

        this.delta = 1;

        this.lastTime = new Date();

        this.elemPunts = $("#punts");
        this.lastPunts = 0;
    }

    draw(){
        this.clearCanvas();
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.draw(this.ctx);

    }
    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

    inicialitza(){
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.mur.draw(this.ctx);

        $(document).on("keydown",{joc:this}, function(e){
            if (e.keyCode == joc.key.LEFT.code) joc.key.LEFT.pressed = true;
            else if (e.keyCode == joc.key.RIGHT.code) joc.key.RIGHT.pressed = true;
        });
        $(document).on("keyup", {joc:this}, function(e){
            if (e.keyCode == joc.key.LEFT.code) joc.key.LEFT.pressed = false;
            else if (e.keyCode == joc.key.RIGHT.code) joc.key.RIGHT.pressed = false;
        });

        $("#reloadWin").click(function(){
            let nom = $(".nom").find("input").filter(function() { return !!this.value; });
            if (nom.length > 0) {
                nom = nom[0].value;
                joc.ranking.afegirPuntuacio(nom, joc.punts);
            }

            window.location.reload();
        });
        $("#reloadLose").click(function(){
            let nom = $(".nom").find("input").filter(function() { return !!this.value; });
            if (nom.length > 0) {
                nom = nom[0].value;
                joc.ranking.afegirPuntuacio(nom, joc.punts);
            }

            window.location.reload();
        });

        document.dispatchEvent(new CustomEvent("gameStart"));
    }

    updateSpeed() {
        if (this.gameover) this.velocitat = 0;
        else this.velocitat = 1 + this.totxosTrencats / this.totxosTotals * 1.5;
    }

    update(){

        const currentTime = new Date();
        this.delta = (currentTime - this.lastTime) / 1000 * this.velocitat;

        this.bola.update();
        this.pala.update();
        this.updateSpeed();
        this.draw();

        if (this.lastPunts != this.punts) {
            let size = this.punts.toString().length;
            
            let s = "";
            for (let i = 0; i < 3 - size; i++)
                s += "0"

            this.elemPunts.text(s + this.punts);
            this.lastPunts = this.punts;
        }

        if (this.totxosTotals/this.totxosTrencat > 0.5 && this.vides < 3 && this.vidaAddicional == false){
            this.vides += 1;
            this.vidaAddicional = true;
        }
        
        this.lastTime = currentTime;

        if (this.totxosTrencats == this.totxosTotals && !this.gameoverOpened){
            this.gameoverOpened = true;
            this.velocitat = 0;
            $("#finestraWin").addClass("abrir");
        }
        else if(this.gameover == true && !this.gameoverOpened){
            this.gameoverOpened = true;
            this.velocitat = 0;
            $("#finestraLose").addClass("abrir");
        }
        $(".completado").html("Has conseguido una puntuación de: " + this.punts + " puntos");

    }
}