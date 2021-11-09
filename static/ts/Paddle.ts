import { PaddleInitializer } from "./types.js";

export default class Paddle {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;
  private readonly initTop: number;
  private readonly speed: number = 20;
  public readonly left: number;
  public readonly right: number;
  public top: number;

  constructor(initializer: PaddleInitializer) {
    this.ctx = initializer.ctx;
    this.width = initializer.width;
    this.height = initializer.height;
    this.left = initializer.left;
    this.right = this.left + this.width;
    this.initTop = initializer.top;
    this.top = initializer.top;
  }

  public get bottom(): number {
    return this.top + this.height;
  }

  public moveUp(): void {
    this.top -= this.speed;
  }

  public moveDown(): void {
    this.top += this.speed;
  }

  public draw(): void {
    this.ctx.fillRect(this.left, this.top, this.width, this.height);
  }

  public reset(): void {
    this.top = this.initTop;
  }
}