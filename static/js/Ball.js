import Paddle from "./Paddle.js";
import PongCanvas from "./PongCanvas.js";
export default class Ball {
    constructor() {
        this.speed = 4;
        this.x = PongCanvas.centerX;
        this.y = PongCanvas.centerY;
        this.radius = Paddle.width / 2;
        this.xDir = -this.speed;
        this.yDir = this.randomDir();
    }
    get top() {
        return this.y - this.radius;
    }
    get bottom() {
        return this.y + this.radius;
    }
    get left() {
        return this.x - this.radius;
    }
    get right() {
        return this.x + this.radius;
    }
    get side() {
        if (this.x < PongCanvas.cWidth / 2)
            return "left";
        return "right";
    }
    randomDir() {
        const multiplier = (Math.random() < 0.5) ? -1 : 1;
        return this.speed / 2 * multiplier;
    }
    move() {
        this.x += this.xDir;
        this.y += this.yDir;
    }
    changeXDir() {
        this.xDir *= -1;
    }
    reset() {
        this.x = PongCanvas.centerX;
        this.y = PongCanvas.centerY;
        this.xDir *= -1;
        this.yDir = this.randomDir();
    }
    isOut(side) {
        switch (side) {
            case "left":
                return this.xDir < 0 && this.left < 0;
            case "right":
                return this.xDir > 0 && this.right > PongCanvas.cWidth;
        }
    }
    touchesPaddle() {
        let paddle;
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
    touchesTopOrBottom() {
        return this.top <= 0 || this.bottom >= PongCanvas.cHeight;
    }
    updateCoordinates() {
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
    draw() {
        this.updateCoordinates();
        PongCanvas.ctx.fillStyle = PongCanvas.itemsColor;
        PongCanvas.ctx.beginPath();
        PongCanvas.ctx.arc(PongCanvas.ball.x, PongCanvas.ball.y, PongCanvas.ball.radius, 0, 2 * Math.PI);
        PongCanvas.ctx.fill();
    }
}
