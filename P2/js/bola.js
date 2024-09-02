class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.posicioInicial = new Punt(puntPosicio.x, puntPosicio.y);
        this.vx = (Math.random() > .5 ? 1 : -1) * 100;
        this.vy = -100;
        this.color = "#fff";
        this.maxDist = null;
        this.colisionat = false;
      
    };

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    mou(x,y){
        this.posicio.x += x * joc.delta;
        this.posicio.y += y * joc.delta;
    }
    update(){

        let totxos = joc.mur.generarTotxos;

        if (this.maxDist == null) {
            for (let i = 0; i < totxos.length; i++) {
                let hipotenusa = Math.sqrt(totxos[i].amplada**2 + totxos[i].alcada**2);
                if (hipotenusa > this.maxDist) this.maxDist = hipotenusa
            }
        }

        let puntActual = this.posicio;
        let puntSeguent= new Punt(this.posicio.x + this.vx * joc.delta, this.posicio.y + this.vy * joc.delta);
        let trajectoria= new Segment(puntActual, puntSeguent);
        let exces;
        let xoc = false;

        if (this.colisionat) {
            this.colisionat = false;
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }
        

        //Xoc amb els laterals del canvas
        //Xoc lateral superior
        if (trajectoria.puntB.y - this.radi < 0) {
            exces = (trajectoria.puntB.y - this.radi) / this.vy * joc.delta;
            this.posicio.x = trajectoria.puntB.x - exces * this.vx * joc.delta;
            this.posicio.y = this.radi;
            xoc = true;
            this.vy = -this.vy;
            reproducirEfecto("impact-sound");
        }
        //Xoc lateral dret
        if (trajectoria.puntB.x + this.radi > joc.amplada) {
            exces = (trajectoria.puntB.x + this.radi) / this.vx * joc.delta;
            this.posicio.x = joc.amplada - this.radi;
            this.posicio.y = trajectoria.puntB.y - exces * this.vy * joc.delta;
            xoc = true;
            this.vx = -this.vx;
            reproducirEfecto("impact-sound");
        }
        //Xoc lateral esquerra
        if (trajectoria.puntB.x - this.radi < 0) {
            exces = (trajectoria.puntB.x - this.radi) / this.vx * joc.delta;
            this.posicio.x = this.radi;
            this.posicio.y = trajectoria.puntB.y + exces * this.vy * joc.delta;
            xoc = true;
            this.vx = -this.vx;
            reproducirEfecto("impact-sound");
        }
        //Xoc lateral inferior

        // -- PER A LES COL·LISIONS --
        // Normalitzem el vector trajectoria
        let llargaria = Punt.distanciaDosPunts(trajectoria.puntA, trajectoria.puntB);
        let trajectNorm = trajectoria.puntB.restar(trajectoria.puntA).div(llargaria);

        // Li sumem el radi a la trajectoria
        let trajCentral = new Segment(
            trajectoria.puntA,
            trajectoria.puntB.sumar(trajectNorm.mult(this.radi))
        )

        let trajDreta = new Segment(
            trajectoria.puntA.sumar(trajectNorm.rotar(Math.PI / 2).mult(this.radi)),
            trajectoria.puntB.sumar(trajectNorm.rotar(Math.PI / 2).mult(this.radi))
        );

        let trajEsquerra = new Segment(
            trajectoria.puntA.sumar(trajectNorm.rotar(-Math.PI / 2).mult(this.radi)),
            trajectoria.puntB.sumar(trajectNorm.rotar(-Math.PI / 2).mult(this.radi))
        );
      
        //Xoc amb la pala

        let interseccio = this.interseccioSegmentRectangle(trajCentral, joc.pala);
        

        // Canvi de direcció de la bola
        if (interseccio) {

            // Aleatorietat per evitar situacions on no es pot guanyar la partida
            const vel = new Punt(this.vx, this.vy).rotar((Math.random() - .5) / 1.5);
            this.vx = vel.x;
            this.vy = vel.y;

            reproducirEfecto("impact-sound");

            if (
                (interseccio.pI.x < joc.pala.posicio.x + joc.pala.amplada / 2 && this.vx > 0)
                || (interseccio.pI.x > joc.pala.posicio.x + joc.pala.amplada / 2 && this.vx < 0)
            ) this.vx *= -1;

        } 

        //Xoc amb els totxos del mur
        //Utilitzem el mètode INTERSECCIOSEGMENTRECTANGLE

        let totxoTocat = null;
        
        if (!interseccio) {
            for (let i = 0; i < totxos.length; i++) {
                let totxo = totxos[i];

                if (Math.sqrt((totxo.posicio.x - this.posicio.x)**2 + (totxo.posicio.y - this.posicio.y)**2) > this.maxDist + this.radi)
                    continue;

                interseccio = this.interseccioSegmentRectangle(trajCentral, totxo, 0) || this.interseccioSegmentRectangle(trajDreta, totxo, 1) || this.interseccioSegmentRectangle(trajEsquerra, totxo, 2);
                if (interseccio) {
                    totxoTocat = totxos[i];
                    break;
                }
            }
        }

        if (interseccio) {

            // Mou la bola al punt d'intersecció tenint en compte l'excés del radi
            if (interseccio.flag == 0)
                this.posicio = interseccio.pI.restar(trajectNorm.mult(this.radi));

            else if (interseccio.flag == 1)
                this.posicio = interseccio.pI.restar(trajectNorm.rotar(Math.PI / 2).mult(this.radi));

            else if (interseccio.flag == 2)
                this.posicio = interseccio.pI.restar(trajectNorm.rotar(-Math.PI / 2).mult(this.radi));

            let vora = interseccio.vora;
            if (vora == "inferior" || vora == "superior") this.vy *= -1;
            else if (vora == "esquerra" || vora == "dreta") this.vx *= -1;

            xoc = true;

            if (totxoTocat != null) {
                totxoTocat.xoc();

                let nivell = joc.mur.nivell;
                joc.punts = joc.totxosTrencats * (nivell == 0 ? 5 : (nivell == 1 ? 10 : 15));
            }

        }

        if (trajCentral.puntB.y - this.radi > joc.alcada) {
            joc.vides = joc.vides - 1;
            if (joc.vides == 2){
                $("#vida3").addClass("bi bi-heartbreak");
            }else if (joc.vides == 1){
                $("#vida2").addClass("bi bi-heartbreak");
            }else{
                $("#vida1").addClass("bi bi-heartbreak");
                joc.gameover = true;
            }
            this.posicio = new Punt(this.posicioInicial.x, this.posicioInicial.y);

            this.vx = (Math.random() > .5 ? 1 : -1) * 100;
            this.vy = -100;
            return;             
        }

        if (xoc) this.colisionat = true;

        if (!xoc){
            this.posicio.x = trajectoria.puntB.x;
            this.posicio.y = trajectoria.puntB.y;
        }
        
    }

    static provarVores(segment, segments) {
        let puntI = null;
        let puntIMin;
        let distanciaI;
        let distanciaIMin = Infinity;
        let voraI;

        puntI = segment.puntInterseccio(segments[0]);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "superior";
            }
        }
        //vora inferior
        puntI = segment.puntInterseccio(segments[1]);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "inferior";
            }
        }

        //vora esquerra
        puntI = segment.puntInterseccio(segments[2]);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "esquerra";
            }
        }

        //vora dreta
        puntI = segment.puntInterseccio(segments[3]);
        if (puntI){
            //distancia entre dos punts, el punt inicial del segment i el punt d'intersecció
            distanciaI = Punt.distanciaDosPunts(segment.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "dreta";
            }
        }

        return {pI: puntIMin, vora: voraI}
    }

    interseccioSegmentRectangle(segment, rectangle, flag){

       //1r REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
       //SI EXISTEIX, QUIN ÉS AQUEST PUNT
       //si hi ha més d'un, el més ajustat
       let puntI;
       let puntIMin;
       let distanciaIMin = Infinity;
       let voraI;

       //calcular punt d'intersecció amb les 4 vores del rectangle
       //necessitem coneixer els 4 segments del rectangle
       //vora superior
       let segmentVoraSuperior = new  Segment(rectangle.posicio,
           new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y));
       //vora inferior
       let segmentVoraInferior = new  Segment(new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),
        new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada));
      
       //vora esquerra
       let segmentVoraEsquerra = new  Segment(rectangle.posicio,
        new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada));
      
       //vora dreta
       let segmentVoraDreta = new  Segment(new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),
        new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada));

        let segments = [segmentVoraSuperior, segmentVoraInferior, segmentVoraEsquerra, segmentVoraDreta]
      

       //2n REVISAR SI EXISTEIX UN PUNT D'INTERSECCIÓ EN UN DELS 4 SEGMENTS
       //SI EXISTEIX, QUIN ÉS AQUEST PUNT
       //si hi ha més d'n, el més ajustat

       let resultat = Bola.provarVores(segment, segments);
       
       //Retorna la vora on s'ha produït la col·lisió, i el punt (x,y)
       if(resultat.vora){
           return {pI: resultat.pI, vora: resultat.vora, flag: flag};
       }
       return false;
    }

    distancia = function(p1,p2){
        return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
    }
}

