import Paddle from "./Paddle.js";
import PongCanvas from "./PongCanvas.js";
import { Side } from "./types.js";

export default class Ball {
  private readonly speed: number = 4;
  public readonly radius: number;
  public x: number;
  public y: number;
  public xDir: number;
  public yDir: number;

  constructor() {
    this.x = PongCanvas.centerX;
    this.y = PongCanvas.centerY;
    this.radius = Paddle.width / 2;
    this.xDir = -this.speed;
    this.yDir = this.randomDir();
  }

  public get top(): number {
    return this.y - this.radius;
  }

  public get bottom(): number {
    return this.y + this.radius;
  }

  public get left(): number {
    return this.x - this.radius;
  }

  public get right(): number {
    return this.x + this.radius;
  }

  public get side(): Side {
    if (this.x < PongCanvas.cWidth / 2)
      return "left";
    return "right";
  }

  private randomDir(): number {
    const multiplier = (Math.random() < 0.5) ? -1 : 1;
    return this.speed / 2 * multiplier;
  }

  public move(): void {
    this.x += this.xDir;
    this.y += this.yDir;
  }

  public changeXDir(): void {
    this.xDir *= -1;
  }

  public reset(): void {
    this.x = PongCanvas.centerX;
    this.y = PongCanvas.centerY;
    this.xDir *= -1;
    this.yDir = this.randomDir();
  }

  public isOut(side: Side) {
    switch (side) {
      case "left":
        return this.xDir < 0 && this.left < 0;
      case "right":
        return this.xDir > 0 && this.right > PongCanvas.cWidth;
    }
  }

  public touchesPaddle() {
    let paddle: Paddle;

    switch (this.side) {
      case "left":
        paddle = PongCanvas.leftPaddle;
        return this.left <= paddle.right
          && this.left > paddle.left
          && this.bottom >= paddle.top
          && this.top <= paddle.bottom;
      case "right":
        paddle = PongCanvas.rightPaddle;
        return this.right >= paddle.left
          && this.left < paddle.right
          && this.bottom >= paddle.top
          && this.top <= paddle.bottom;
    }
  }

  public touchesTopOrBottom(): boolean {
    return this.top <= 0 || this.bottom >= PongCanvas.cHeight;
  }

  private updateCoordinates() {
    this.move();

    if (this.isOut("left")) {
      PongCanvas.rightScore++;
      return PongCanvas.reset();
    }

    if (this.isOut("right")) {
      PongCanvas.leftScore++;
      return PongCanvas.reset();
    }

    if (this.touchesPaddle())
      this.changeXDir();

    if (this.touchesTopOrBottom())
      this.yDir *= -1;
  }

  public draw(): void {
    this.updateCoordinates();
    PongCanvas.ctx.fillStyle = PongCanvas.itemsColor;
    PongCanvas.ctx.beginPath();
    PongCanvas.ctx.arc(
      PongCanvas.ball.x,
      PongCanvas.ball.y,
      PongCanvas.ball.radius,
      0,
      2 * Math.PI
    );
    PongCanvas.ctx.fill();
  }
}