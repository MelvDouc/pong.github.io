import Paddle from "./Paddle.js";
import Ball from "./Ball.js";

export default class PongCanvas extends HTMLCanvasElement {
  static leftPaddle: Paddle;
  static rightPaddle: Paddle;
  static ball: Ball;
  static ctx: CanvasRenderingContext2D;
  static cWidth: number;
  static cHeight: number;
  static leftScore: number = 0;
  static rightScore: number = 0;
  static itemsColor = "white";
  static textY: number;
  static requestID: number;

  static get centerX(): number {
    return this.cWidth / 2;
  }

  static get centerY(): number {
    return this.cHeight / 2;
  }

  static movePaddles(e: KeyboardEvent) {
    switch (e.key) {
      case "a":
        if (this.leftPaddle.top > 0)
          this.leftPaddle.moveUp();
        break;
      case "q":
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

  static draw(): void {
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

  static drawBackground(): void {
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

  static drawScore(): void {
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "lightskyblue";
    this.ctx.font = "45px Consolas";
    this.ctx.fillText(
      this.leftScore.toString(),
      this.cWidth * 0.25,
      this.textY
    );
    this.ctx.fillText(
      this.rightScore.toString(),
      this.cWidth * 0.75,
      this.textY
    );
  }

  constructor() {
    super();

    PongCanvas.ctx = <CanvasRenderingContext2D>this.getContext("2d");

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

  get dimensions() {
    const parent = <HTMLElement>this.parentElement,
      computedStyle = getComputedStyle(parent),
      parentWidth = parseFloat(computedStyle.width),
      parentHeight = parseFloat(computedStyle.height);
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