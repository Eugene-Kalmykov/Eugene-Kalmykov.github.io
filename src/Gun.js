export class Gun {

    constructor(canvas) {
        this.angle = 90;
        this.currentAngle = this.angle;
        this.gunHeight = 60;
        this.bottomGunX = canvas.width / 2;
        this.bottomGunY = canvas.height;
        this.topGunX = this.bottomGunX;
        this.topGunY = this.bottomGunY - this.gunHeight;
    }

    updateAngle(angle) {
        this.currentAngle = angle;
        this.topGunX = this.bottomGunX + this.gunHeight * Math.cos((-this.currentAngle * Math.PI) / 180);
        this.topGunY = this.bottomGunY + this.gunHeight * Math.sin((-this.currentAngle * Math.PI) / 180);
    }

    renderGun(angle, canvasContext) {
        this.updateAngle(angle);

        canvasContext.strokeStyle = "black";
        canvasContext.lineCap = "round";
        canvasContext.lineWidth = 30;
        canvasContext.beginPath();
        canvasContext.moveTo(this.bottomGunX, this.bottomGunY);
        canvasContext.lineTo(this.topGunX, this.topGunY);
        canvasContext.stroke();
    }
}
