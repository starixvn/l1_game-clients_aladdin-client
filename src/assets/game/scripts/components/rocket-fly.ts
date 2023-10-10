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

    @property(Node)
    point1: Node = null;

    @property(Node)
    point2: Node = null;

    @property(Node)
    point3: Node = null;

    @property(Node)
    point4: Node = null;

    playAnim = false;
    targetPoint;
    //Define the bezier curve movement of the rocket
    points = [
        // { x: this.startPoint.x, y: this.startPoint.y },
        // { x: this.point2.position.x, y: this.point2.position.y },
        // { x: this.point3.position.x, y: this.point3.position.y },
        // { x: this.point4.position.x, y: this.point4.position.y },
    ];
    maxMutiplierFly = 10;
    currentMultiplier = 0;
    linePercent = 0;
    isExplode = false;
    multiplierTween;
    point1Position;
    point2Position;
    point3Position;
    point4Position;

    onLoad() {
        super.onLoad();
        this.point1Position = this.point1.position;
        this.point2Position = this.point2.position;
        this.point3Position = this.point3.position;
        this.point4Position = this.point4.position;

        this.targetPoint = { x: this.point1Position.x, y: this.point1Position.y, speed: 0.1, t: 0 };
        //Define the bezier curve movement of the rocket
        this.points = [
            { x: this.targetPoint.x, y: this.targetPoint.y },
            { x: this.point2Position.x, y: this.point2Position.y },
            { x: this.point3Position.x, y: this.point3Position.y },
            { x: this.point4Position.x, y: this.point4Position.y },
        ];
    }

    moveBallInBezierCurve() {
        let [p0, p1, p2, p3] = this.points;

        if (this.targetPoint.x === p3.x || this.targetPoint.t > 1) {
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
        this.targetPoint.t += this.targetPoint.speed;
        //Calculate new X & Y positions of ball
        let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
        let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

        //We draw the ball to the canvas in the new location
        this.targetPoint.x = xt;
        this.targetPoint.y = yt;

        const deltaX = Math.abs(xt - this.rocket.position.x);
        const deltaY = Math.abs(yt - this.rocket.position.y);
        const angle = -90 + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

        this.rocket.eulerAngles = v3(0, 0, angle);
        console.log("rocket angle:", angle);
        this.updateBallPosition();
    }

    updateBallPosition() {
        this.rocket.position = v3(this.targetPoint.x, this.targetPoint.y, this.rocket.position.z);
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
        this.targetPoint.t = 0;
        this.targetPoint.x = this.point1Position.x;
        this.targetPoint.y = this.point1Position.y;
        this.rocket.position = v3(this.point1Position.x, this.point1Position.y, this.rocket.position.z);
    }
}
