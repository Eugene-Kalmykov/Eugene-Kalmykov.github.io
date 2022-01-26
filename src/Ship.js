export class Ship {

    constructor(canvas) {
        this.shipLength = 230;
        this.shipHeight = 30;
        this.startPosition = this.getRandomStartPosition(canvas);
        this.shipX = this.startPosition;
        this.shipSpeed = 1.5 * Math.random();
        this.shipTypeRandom = Math.round(Math.random());
    }

    getRandomStartPosition (canvas) {
        const randomValue = Math.round(Math.random());
        if (randomValue === 0) {
            return -this.shipLength;
        }
        if (randomValue === 1) {
            return canvas.width;
        }
    }

    shipRender(canvas) {
        const canvasContext = canvas.getContext("2d");
        const shipHtmlElement = document.querySelector("#ship");
        if (this.startPosition > 0) {
            if (this.shipTypeRandom === 0) {
                canvasContext.drawImage(shipHtmlElement, 300, 40, 215, 75, this.shipX, canvas.height/5 - 45, this.shipLength, this.shipHeight + 45);
            }
            if (this.shipTypeRandom === 1) {
                canvasContext.drawImage(shipHtmlElement, 30, 170, 220, 65, this.shipX, canvas.height/5 - 35, this.shipLength, this.shipHeight + 35);
            }
        }
        if (this.startPosition < 0) {
            if (this.shipTypeRandom === 0) {
                canvasContext.drawImage(shipHtmlElement, 295, 300, 230, 45, this.shipX, canvas.height/5 - 15, this.shipLength, this.shipHeight + 15);
            }
            if (this.shipTypeRandom === 1) {
                canvasContext.drawImage(shipHtmlElement, 30, 285, 225, 60, this.shipX, canvas.height/5 - 30, this.shipLength, this.shipHeight + 30);
            }
        }
    }

    shipMove(canvas, shipHtmlElement) {
        this.shipRender(canvas, shipHtmlElement);

        if (this.startPosition < 0) {
            this.shipX += 1 + this.shipSpeed;
        }

        if (this.startPosition > 0) {
            this.shipX += -1 - this.shipSpeed;
        }
    }
}
