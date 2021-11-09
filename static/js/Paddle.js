import PongCanvas from "./PongCanvas.js";
export default class Paddle {
    constructor(left, side) {
        this.speed = 20;
        this.left = left;
        this.right = this.left + Paddle.width;
        this.top = Paddle.initTop;
        this.side = side;
    }
    get bottom() {
        return this.top + Paddle.height;
    }
    moveUp() {
        this.top -= this.speed;
    }
    moveDown() {
        this.top += this.speed;
    }
    draw() {
        PongCanvas.ctx.fillRect(this.left, this.top, Paddle.width, Paddle.height);
    }
    reset() {
        this.top = Paddle.initTop;
    }
}
