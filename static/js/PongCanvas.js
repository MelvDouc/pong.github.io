import Paddle from "./Paddle.js";
import Ball from "./Ball.js";
export default class PongCanvas extends HTMLCanvasElement {
    constructor() {
        super();
        PongCanvas.ctx = this.getContext("2d");
        const { width, height } = this.dimensions;
        PongCanvas.cWidth = width;
        PongCanvas.cHeight = height;
        Paddle.width = width / 40;
        Paddle.height = height / 4;
        Paddle.initTop = (height - Paddle.height) / 2;
        PongCanvas.textY = (height + 45) / 2;
        this.setAttribute("width", width.toString());
        this.setAttribute("height", height.toString());
        PongCanvas.leftPaddle = new Paddle(Paddle.width, "left");
        PongCanvas.rightPaddle = new Paddle(width - Paddle.width * 2, "right");
        PongCanvas.ball = new Ball();
    }
    static get centerX() {
        return this.cWidth / 2;
    }
    static get centerY() {
        return this.cHeight / 2;
    }
    static movePaddles(e) {
        switch (e.key) {
            case "w":
                if (this.leftPaddle.top > 0)
                    this.leftPaddle.moveUp();
                break;
            case "Alt":
                if (this.leftPaddle.bottom < this.cHeight)
                    this.leftPaddle.moveDown();
                break;
            case "ArrowUp":
                if (this.rightPaddle.top > 0)
                    this.rightPaddle.moveUp();
                break;
            case "ArrowDown":
                if (this.rightPaddle.bottom < this.cHeight)
                    this.rightPaddle.moveDown();
                break;
            default:
                break;
        }
    }
    static draw() {
        this.requestID = requestAnimationFrame(this.draw.bind(this));
        this.drawBackground();
        this.ctx.fillStyle = this.itemsColor;
        this.leftPaddle.draw();
        this.rightPaddle.draw();
        this.drawScore();
        this.ball.draw();
    }
    static reset() {
        this.ball.reset();
        this.leftPaddle.reset();
        this.rightPaddle.reset();
        setTimeout(() => {
            cancelAnimationFrame(this.requestID);
            this.draw();
        }, 1000);
    }
    static drawBackground() {
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0, 0, this.cWidth, this.cHeight);
        this.ctx.strokeStyle = this.itemsColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 15]);
        this.ctx.moveTo(this.cWidth / 2, 0);
        this.ctx.lineTo(this.cWidth / 2, this.cHeight);
        this.ctx.stroke();
    }
    static drawScore() {
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "lightskyblue";
        this.ctx.font = "45px Consolas";
        this.ctx.fillText(this.leftScore.toString(), this.cWidth * 0.25, this.textY);
        this.ctx.fillText(this.rightScore.toString(), this.cWidth * 0.75, this.textY);
    }
    get dimensions() {
        const parent = this.parentElement, computedStyle = getComputedStyle(parent), parentWidth = parseFloat(computedStyle.width), parentHeight = parseFloat(computedStyle.height);
        return {
            width: parentWidth * 0.8,
            height: parentHeight * 0.8
        };
    }
    connectedCallback() {
        window.addEventListener("keydown", PongCanvas.movePaddles.bind(PongCanvas));
        PongCanvas.draw();
    }
}
PongCanvas.leftScore = 0;
PongCanvas.rightScore = 0;
PongCanvas.itemsColor = "white";
