class Ranking {
    constructor(elemBoto, elemFinestra, elemRanking) {
        this.puntuacions = [];

        this.elemBoto = elemBoto;
        this.elemFinestra = elemFinestra;
        this.elemRanking = elemRanking;

        this.elemBoto.on("click", () => {
            this.obrirFinestra();
        });

        this.elemRanking.find("#ranking-close").on("click", () => {
            this.tancarFinestra();
        });
    }

    carregarPuntuacions() {
        const punts = JSON.parse(localStorage.getItem("puntuacions"));
        if (punts !== null) {
            this.puntuacions = punts;
            this.puntuacions.sort((a, b) => a.punts < b.punts ? 1 : -1);
        }
    }

    guardarPuntuacions() {
        localStorage.setItem("puntuacions", JSON.stringify(this.puntuacions));
    }

    afegirPuntuacio(nom, punts, noGuardar) {

        if (this.puntuacions.length > 0 && punts < this.puntuacions[this.puntuacions.length - 1].punts) return;

        this.puntuacions.push({
            "nom": nom,
            "punts": punts
        });

        this.puntuacions.sort((a, b) => a.punts < b.punts ? 1 : -1);

        if (this.puntuacions.length > 10) this.puntuacions.pop();

        if (!noGuardar) this.guardarPuntuacions();
    }

    obrirFinestra() {
        this.elemFinestra.css({"display": "flex"});

        if (this.puntuacions.length == 0) return;

        this.elemRanking.find("p").addClass("hidden");
        this.elemRanking.find("table").removeClass("hidden");

        this.elemRanking.find("table").find("tbody").html("<tr><th>Nom</th><th>Punts</th></tr>");
        
        for (let i = 0; i < this.puntuacions.length; i++) {
            const puntuacio = this.puntuacions[i];
            this.elemRanking.find("table").find("tbody")
                .append($("<tr>")
                    .append($("<td>")
                        .text(puntuacio.nom)
                    )
                    .append($("<td>")
                        .text(puntuacio.punts)
                    )
                );
        }
    }

    tancarFinestra() {
        this.elemFinestra.css({"display": "none"});
    }

}