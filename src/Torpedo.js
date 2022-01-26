export class Torpedo {

    constructor(x, y, angle) {
        this.torpedoX = x;
        this.torpedoY = y;
        if (angle) {
            this.angle = angle;
        }
    }

    showTorpedo(canvasContext) {
        canvasContext.beginPath();
        canvasContext.arc(this.torpedoX, this.torpedoY, 10, 0, Math.PI * 2,);
        canvasContext.fillStyle = "red";
        canvasContext.fill();
        canvasContext.closePath();
    };

    drawTorpedoFlying(canvasContext) {
        this.showTorpedo(canvasContext);
        this.torpedoX += 2 * Math.cos((-this.angle * Math.PI) / 180);
        this.torpedoY += 2 * Math.sin((-this.angle * Math.PI) / 180);
    }
}
