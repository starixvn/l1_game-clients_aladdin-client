import { _decorator, Node, Sprite, tween, v3 } from "cc";
import { random } from "lodash-es";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

@ccclass
export class RocketFly extends ObserverComponent {
    @property(Node)
    rocket: Node = null;

    @property(Sprite)
    rocketLine: Sprite = null;

    playAnim = false;
    defaultRocketPoint = { x: -520, y: -198, speed: 0.1, t: 0 };
    //Define the bezier curve movement of the rocket
    points = [
        { x: this.defaultRocketPoint.x, y: this.defaultRocketPoint.y },
        { x: -96, y: -224 },
        { x: 283, y: -89 },
        { x: 520, y: 193 },
    ];
    rocketFlyInterval;
    maxMutiplierFly = 10;
    currentMultiplier = 0;
    linePercent = 0;
    isExplode = false;
    multiplierTween;

    moveBallInBezierCurve() {
        let [p0, p1, p2, p3] = this.points;

        if (this.defaultRocketPoint.x === p3.x || this.defaultRocketPoint.t > 1) {
            this.playAnim = false;
            this.multiplierTween?.stop();
            return;
        }

        //Calculate the coefficients based on where the ball currently is in the animation
        let cx = 3 * (p1.x - p0.x);
        let bx = 3 * (p2.x - p1.x) - cx;
        let ax = p3.x - p0.x - cx - bx;

        let cy = 3 * (p1.y - p0.y);
        let by = 3 * (p2.y - p1.y) - cy;
        let ay = p3.y - p0.y - cy - by;

        let t = this.currentMultiplier / this.maxMutiplierFly;

        //Increment t value by speed
        this.defaultRocketPoint.t += this.defaultRocketPoint.speed;
        //Calculate new X & Y positions of ball
        let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
        let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

        //We draw the ball to the canvas in the new location
        this.defaultRocketPoint.x = xt;
        this.defaultRocketPoint.y = yt;
        this.updateBallPosition();
    }

    updateBallPosition() {
        this.rocket.position = v3(this.defaultRocketPoint.x, this.defaultRocketPoint.y, this.rocket.position.z);
        this.rocketLine.fillRange = this.currentMultiplier / this.maxMutiplierFly;
    }

    animate() {
        if (this.isExplode) {
            return;
        }

        this.moveBallInBezierCurve();
    }

    randomMultiplier() {
        this.currentMultiplier = random(1, this.maxMutiplierFly);
        console.log("currentMultiplier", this.currentMultiplier);
    }

    onClickPlay(e) {
        this.reset();
        this.randomMultiplier();
        this.playAnim = true;
        this.multiplierTween?.stop();

        this.multiplierTween = tween(this.node)
            .call(() => {
                this.animate();
                this.currentMultiplier += 0.01;
            })
            .delay(1 / 60)
            .union()
            .repeatForever()
            .start();

        // this.rocketFlyInterval = setInterval(() => {this.animate();}, 1000 / 30);
    }

    onClickExplodeRocket() {
        this.isExplode = true;
        this.multiplierTween?.stop();
        this.rocketLine.fillRange = 0;
        this.rocket.active = false;
        tween(this.node)
            .delay(2)
            .call(() => {
                this.reset();
            })
            .start();
    }

    reset() {
        this.playAnim = false;
        this.isExplode = false;
        this.rocket.active = true;
        this.defaultRocketPoint.t = 0;
        this.defaultRocketPoint.x = -520;
        this.defaultRocketPoint.y = -198;
        this.rocket.position = v3(this.points[0].x, this.points[0].y, this.rocket.position.z);
    }
}
