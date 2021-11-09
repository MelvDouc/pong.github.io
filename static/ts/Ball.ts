export default class Ball {
  private readonly initX: number;
  private readonly initY: number;
  private readonly speed: number = 4;
  public readonly radius: number;
  public x: number;
  public y: number;
  public xDir: number;
  public yDir: number;

  constructor(x: number, y: number, radius: number) {
    this.initX = x;
    this.initY = y;
    this.x = x;
    this.y = y;
    this.radius = radius;
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
    this.x = this.initX;
    this.y = this.initY;
    this.xDir *= -1;
    this.yDir = this.randomDir();
  }
}