import PongCanvas from "./PongCanvas.js";
export default class Paddle {
    constructor(left, side) {
        this.speed = 20;
        this.left = left;
        this.right = this.left + Paddle.width;
        this.top = Paddle.initTop;
        this.side = side;
        document.addEventListener("keydown", this.handleKeydown.bind(this));
    }
    get bottom() {
        return this.top + Paddle.height;
    }
    handleKeydown(e) {
        const { key } = e;
        if (this.side === "left") {
            if (key === "e" && this.top >= 0)
                this.moveUp();
            if (key === "d" && this.bottom <= PongCanvas.cHeight)
                this.moveDown();
        }
        if (this.side === "right") {
            if (key === "ArrowUp" && this.top >= 0)
                this.moveUp();
            if (key === "ArrowDown" && this.bottom <= PongCanvas.cHeight)
                this.moveDown();
        }
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
