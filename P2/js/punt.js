/*
* CLASSE PUNT
*/

class Punt {
    constructor(x, y,) {
        this.x = x;
        this.y = y;
    }
    static distanciaDosPunts(a, b) {
        
        return Math.sqrt(Math.pow(a.x-b.x,2)+ Math.pow(a.y-b.y,2));
    }

    sumar = (p) => new Punt(this.x + p.x, this.y + p.y);
    restar = (p) => new Punt(this.x - p.x, this.y - p.y);
    mult = (num) => new Punt(this.x * num, this.y * num);
    div = (num) => new Punt(this.x / num, this.y / num);
    rotar = (alpha) => new Punt(
        this.x  * Math.cos(alpha) - this.y * Math.sin(alpha),
        this.x * Math.sin(alpha) + this.y * Math.cos(alpha)
    )
}