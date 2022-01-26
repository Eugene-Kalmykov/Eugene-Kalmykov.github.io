export class Visual {

    renderScore (canvasContext, score) {
        canvasContext.font ="30px Arial";
        canvasContext.fillStyle = "black";
        canvasContext.fillText(`Score: ${score}`, 20, 40);
    }

    clear (canvas) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    };

    renderTimer(canvas, sec) {
        const canvasContext = canvas.getContext("2d");
        canvasContext.font ="30px Arial";
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Seconds left: " + sec, canvas.width/2 -150, 40);
    }

    drawWater() {
        const canvas2 = document.querySelector("#Water");
        const ctx2 = canvas2.getContext("2d");
        const water = document.querySelector("#water");
        ctx2.drawImage(water, 0, 0, 1000, 750, 0, 0, canvas2.width, canvas2.height)
    }
}
