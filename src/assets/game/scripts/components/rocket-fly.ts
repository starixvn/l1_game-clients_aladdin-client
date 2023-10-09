import { _decorator, EditBox, Node, Sprite, UITransform, v3 } from "cc";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

@ccclass
export class RocketFly extends ObserverComponent {
    @property(Node)
    rocket: Node = null;

    @property(Sprite)
    rocketLine: Sprite = null;

    @property(EditBox)
    fromMultiplier: EditBox = null;

    @property(EditBox)
    toMultiplier: EditBox = null;

    playAnim = false;
    ball = { x: -520, y: -198, speed: 0.1, t: 0, radius: 20 };
    //Define the bezier curve movement of the rocket
    points = [
        { x: this.ball.x, y: this.ball.y },
        { x: -96, y: -224 },
        { x: 283, y: -89 },
        { x: 520, y: 193 },
    ];
    rocketFlyInterval;
    maxMutiplierFly = 3;
    prevMultiplier = 0;
    currentMultiplier = 0;
    linePercent = 0;

    moveBallInBezierCurve() {
        let [p0, p1, p2, p3] = this.points;
        //Calculate the coefficients based on where the ball currently is in the animation
        let cx = 3 * (p1.x - p0.x);
        let bx = 3 * (p2.x - p1.x) - cx;
        let ax = p3.x - p0.x - cx - bx;

        let cy = 3 * (p1.y - p0.y);
        let by = 3 * (p2.y - p1.y) - cy;
        let ay = p3.y - p0.y - cy - by;

        let t = this.ball.t;

        //Increment t value by speed
        this.ball.t += this.ball.speed;
        //Calculate new X & Y positions of ball
        let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
        let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

        if (this.ball.t > 1) {
            this.ball.t = 1;
        }

        this.linePercent = this.currentMultiplier / this.maxMutiplierFly;
        const rocketFlyLineWidth = this.rocketLine.getComponent(UITransform).width;

        let rocketPathPercent;
        if (xt < 0) {
            rocketPathPercent = (rocketFlyLineWidth / 2 - Math.abs(xt)) / rocketFlyLineWidth;
        } else {
            rocketPathPercent = (rocketFlyLineWidth / 2 + xt) / rocketFlyLineWidth;
        }
        if (rocketPathPercent > this.linePercent || this.ball.x === this.points[3].x) {
            this.prevMultiplier = this.currentMultiplier;
            clearInterval(this.rocketFlyInterval);
            return;
        }

        //We draw the ball to the canvas in the new location
        this.ball.x = xt;
        this.ball.y = yt;
        this.updateBallPosition();
    }

    updateBallPosition() {
        this.rocket.position = v3(this.ball.x, this.ball.y, this.rocket.position.z);
        this.rocketLine.fillRange = this.linePercent;
    }

    animate() {
        // requestAnimationFrame(() => this.animate());
        //Ball code comes below
        if (!this.playAnim) {
            this.updateBallPosition();
        } else {
            this.moveBallInBezierCurve();
        }
    }

    // update() {
    //     if (this.playAnim) {
    //         this.animate();
    //     }
    // }

    calculateMultiplier() {
        this.currentMultiplier += +this.toMultiplier.string - +this.fromMultiplier.string;
    }
    onClickPlay() {
        this.calculateMultiplier();
        this.playAnim = true;
        this.rocketFlyInterval = setInterval(() => {
            this.animate();
        }, 1000 / 30);

        if (this.ball.x === this.points[3].x && this.ball.y === this.points[3].y) {
            //Restart the animation
            this.ball.t = 0;
            this.ball.x = this.points[0].x;
            this.ball.y = this.points[0].y;
            clearInterval(this.rocketFlyInterval);
            this.fromMultiplier.string = "0";
            this.toMultiplier.string = "0";
            this.rocketLine.fillRange = 0;
        }
    }

    onClickRestart() {}
}
