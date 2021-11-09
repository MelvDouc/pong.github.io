import PongCanvas from "./PongCanvas.js";
import { Side } from "./types.js";

export default class Paddle {
  public static width: number;
  public static height: number;
  public static initTop: number;

  private readonly speed: number = 20;
  public readonly left: number;
  public readonly right: number;
  public readonly side: Side;
  public top: number;

  constructor(left: number, side: Side) {
    this.left = left;
    this.right = this.left + Paddle.width;
    this.top = Paddle.initTop;
    this.side = side;
  }

  public get bottom(): number {
    return this.top + Paddle.height;
  }

  public moveUp(): void {
    this.top -= this.speed;
  }

  public moveDown(): void {
    this.top += this.speed;
  }

  public draw(): void {
    PongCanvas.ctx.fillRect(
      this.left,
      this.top,
      Paddle.width,
      Paddle.height
    );
  }

  public reset(): void {
    this.top = Paddle.initTop;
  }
}