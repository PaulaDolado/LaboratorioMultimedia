/*
* CLASSE MUR
*/

class Mur {
    constructor(nivell,amplada, alcada) {
        this.nivell = nivell;
        this.amplada = amplada;
        this.alcada = alcada;
        this.totxoamplada = 50;
        this.totxoalcada = 20;
        this.defineixNivells();
        this.generarTotxos = [];
        this.separacion = 10;

    }
    generaMur(){
        const totxosNivell = this.nivells[this.nivell].totxos;

        const ampladaTotal = (this.totxoamplada + this.separacion) * totxosNivell[totxosNivell.length - 1].length;
        const offset = (this.amplada - ampladaTotal) / 1.5;
                
        for (let x = 0; x < totxosNivell.length; x++) {
            for (let y = 0; y < totxosNivell[x].length; y++) {
                if (totxosNivell[x][y] == "a") {
                    let totxo = new Totxo(
                        new Punt(
                            offset + y * (this.totxoamplada + this.separacion), 
                            x * (this.totxoalcada + this.separacion)),
                            this.totxoamplada,
                            this.totxoalcada,
                            this.nivell
                    )
                    this.generarTotxos.push(totxo);
                }
            }
        }
    }
    draw(ctx){
        ctx.fillStyle = this.nivells[this.nivell].color;
        for (let i = 0; i < this.generarTotxos.length; i++) {
            this.generarTotxos[i].draw(ctx);
        }              
    }
    
    defineixNivells(){
        this.nivells=[
            {
                color: "#7BBA50", // verde 
                totxos:[
                    "",
                    "",
                    "",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                ]
            },
            {
                color: "#FFFF00", // amarillo
                totxos:[
                    "",
                    "",
                    "",
                    "aaaaaaaaaaaa",
                    "     aa     ",
                    "   aaaaaa   ",
                    "   aaaaaa   ",
                    "     aa     ",
                ]
            },
            {
                color: "#D30", // rojo
                totxos:[
                    "",
                    "",
                    "",
                    "aaaaaaaaaaaa",
                    "a          a",
                    " a        a ",
                    "aa        aa",
                    "  aaaaaaaa  ",
                ]
            }
        ];
    }

};