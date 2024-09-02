/*
* CLASSE TOTXO
*/

class Totxo{
    constructor(puntPosicio, amplada, alcada, nivell){
  
    this.amplada=amplada; 
    this.alcada=alcada;         // mides
    this.tocat=false;       // marquem els totxos tocats per la bola => no es pintaran
    this.posicio = puntPosicio;         // posició, en píxels respecte el canvas
    this.color;
    this.punts;
    this.nivell = nivell;

    }
    get area() {
        return this.amplada * this.alcada;
    }
    
    draw(ctx) {
        if (!this.tocat){
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);
            ctx.restore();

        }
    }
    puntInteriorRectangle(punt){
        return (punt.x >= this.posicio.x &&
            punt.x <= this.posicio.x + this.amplada) &&
            (punt.y >= this.posicio.y &&
                punt.y<=this.posicio.y+this.alcada);
    }

    xoc() {

        if (this.nivell == 0) {        
            this.posicio.y = Infinity;
            joc.totxosTrencats++;
            reproducirEfecto("broken-brick");
        } else {
            this.color = joc.mur.nivells[--this.nivell].color;
            reproducirEfecto("impact-sound");
        }
    }
};