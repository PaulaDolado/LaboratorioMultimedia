/*
* CLASSE PALA
*/

class Pala {
    constructor(puntPosicio, amplada, alcada){      
        this.amplada = amplada;
        this.alcada = alcada;
        this.posicio = puntPosicio;
        this.vy = 200;     
        this.vx = 200;                                                     // velocitat = 10 píxels per fotograma
        this.color = "#D30";
        
    }


    update(){

        if (joc.key.LEFT.pressed) this.mou(-this.vx, 0);
        if (joc.key.RIGHT.pressed) this.mou(this.vx, 0);
 
        this.posicio.x = Math.min(joc.amplada - this.amplada, Math.max(0, this.posicio.x))
    
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);
        ctx.restore();

    }
    mou(x,y){
        this.posicio.x += x * joc.delta;
        this.posicio.y += y * joc.delta;
    }
}