import Paddle from "./Paddle.js";
import Ball from "./Ball.js";

export default class PongCanvas extends HTMLCanvasElement {
  readonly ctx: CanvasRenderingContext2D;
  readonly cWidth: number;
  readonly cHeight: number;
  readonly pWidth: number;
  readonly pHeight: number;
  readonly leftPaddle: Paddle;
  readonly rightPaddle: Paddle;
  readonly ball: Ball;
  readonly textY: number;
  readonly itemsColor = "white";
  leftScore: number = 0;
  rightScore: number = 0;
  requestID: number;

  constructor() {
    super();

    this.ctx = <CanvasRenderingContext2D>this.getContext("2d");

    const { width, height } = this.dimensions;
    this.cWidth = width;
    this.cHeight = height;
    this.pWidth = width / 40;
    this.pHeight = height / 4;
    this.textY = (height + 45) / 2;
    this.setAttribute("width", width.toString());
    this.setAttribute("height", height.toString());

    const paddleInitTop = (height - this.pHeight) / 2;
    this.leftPaddle = new Paddle({
      ctx: this.ctx,
      width: this.pWidth,
      height: this.pHeight,
      top: paddleInitTop,
      left: this.pWidth,
    });
    this.rightPaddle = new Paddle({
      ctx: this.ctx,
      width: this.pWidth,
      height: this.pHeight,
      top: paddleInitTop,
      left: this.cWidth - this.pWidth * 2
    });

    this.ball = new Ball(width / 2, height / 2, this.pWidth / 2);
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
    window.addEventListener("keydown", (e) => {
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
    });

    this.draw();
  }

  draw(): void {
    this.requestID = requestAnimationFrame(this.draw.bind(this));
    this.drawBackground();
    this.ctx.fillStyle = this.itemsColor;
    this.leftPaddle.draw();
    this.rightPaddle.draw();
    this.drawScore();
    this.drawBall();
  }

  reset() {
    this.ball.reset();
    this.leftPaddle.reset();
    this.rightPaddle.reset();
    setTimeout(() => {
      cancelAnimationFrame(this.requestID);
      this.draw();
    }, 1000);
  }

  drawBackground(): void {
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

  drawScore(): void {
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

  isBallOnLeftPaddle(): boolean {
    return this.ball.left <= this.leftPaddle.right
      && this.ball.left > this.leftPaddle.left
      && this.ball.bottom >= this.leftPaddle.top
      && this.ball.top <= this.leftPaddle.bottom;
  }

  isBallOnRightPaddle(): boolean {
    return this.ball.right >= this.rightPaddle.left
      && this.ball.left < this.rightPaddle.right
      && this.ball.bottom >= this.rightPaddle.top
      && this.ball.top <= this.rightPaddle.bottom;
  }

  updateBallCoordinates() {
    const { ball } = this;
    ball.move();

    if (ball.xDir < 0 && ball.left < 0) {
      this.rightScore++;
      return this.reset();
    }

    if (ball.xDir > 0 && ball.right > this.cWidth) {
      this.leftScore++;
      return this.reset();
    }

    if (this.isBallOnLeftPaddle() || this.isBallOnRightPaddle())
      ball.changeXDir();

    if (ball.top <= 0 || ball.bottom >= this.cHeight)
      ball.yDir *= -1;
  }

  drawBall(): void {
    this.updateBallCoordinates();
    this.ctx.fillStyle = this.itemsColor;
    this.ctx.beginPath();
    this.ctx.arc(
      this.ball.x,
      this.ball.y,
      this.ball.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }
}