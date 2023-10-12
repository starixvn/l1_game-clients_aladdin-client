import gc from "@sg/game-client-base";
import { _decorator, Node, Sprite, SpriteFrame, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

const { render, handle } = Observer;
@ccclass
export class RocketFly extends ObserverComponent {
    @property(Node)
    nodeRocket: Node = null;

    @property(Sprite)
    sprRocketLine: Sprite = null;

    @property(SpriteFrame)
    fraLevel1Line: SpriteFrame = null;

    @property(SpriteFrame)
    fraLevel2Line: SpriteFrame = null;

    @property(SpriteFrame)
    fraLevel3Line: SpriteFrame = null;

    @property(Node)
    nodePoint1: Node = null;

    @property(Node)
    nodePoint2: Node = null;

    @property(Node)
    nodePoint3: Node = null;

    @property(Node)
    nodePoint4: Node = null;

    playAnim = false;
    point1Position = v3(0, 0, 0);
    point2Position = v3(0, 0, 0);
    point3Position = v3(0, 0, 0);
    point4Position = v3(0, 0, 0);

    targetPoint;
    //Define the bezier curve movement of the rocket
    points = [];
    maxMutiplierFly = 3;
    currentMultiplier = 0;
    linePercent = 0;
    isExplode = false;
    multiplierTween;
    startRound = false;
    defaultAngle = -90;
    flyTween;
    level1Multiplier = 5;
    level2Multiplier = 10;

    onLoad() {
        super.onLoad();
        this.nodeRocket.active = false;
        this.sprRocketLine.fillRange = 0;
        this.point1Position = this.nodePoint1.position;
        this.point2Position = this.nodePoint2.position;
        this.point3Position = this.nodePoint3.position;
        this.point4Position = this.nodePoint4.position;

        this.targetPoint = { x: this.point1Position.x, y: this.point1Position.y, speed: 0.1, t: 0.1 };
        //Define the bezier curve movement of the rocket
        this.points = [
            { x: this.targetPoint.x, y: this.targetPoint.y },
            { x: this.point2Position.x, y: this.point2Position.y },
            { x: this.point3Position.x, y: this.point3Position.y },
            { x: this.point4Position.x, y: this.point4Position.y },
        ];
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    setCurrentMultiplier(multiplier: number) {
        console.log("multiplier: ", multiplier);
        let fraLine: SpriteFrame;

        if (multiplier <= this.level1Multiplier) {
            fraLine = this.fraLevel1Line;
        } else if (multiplier <= this.level2Multiplier) {
            fraLine = this.fraLevel2Line;
        } else {
            fraLine = this.fraLevel3Line;
        }

        this.sprRocketLine.spriteFrame = fraLine;
        this.currentMultiplier = multiplier - 1;
        this.animate();
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.startNewRound)
    appearRocket(startNewRound: boolean) {
        if (this.points.length < 1) {
            return;
        }

        this.startRound = startNewRound;
        if (startNewRound) {
            console.log("-----start game----");
            this.nodeRocket.active = true;
            this.nodeRocket.position = v3(this.point1Position.x, this.point1Position.y, this.nodeRocket.position.z);
            this.sprRocketLine.fillRange = 0;
        } else {
            console.log("-----end game----");
            this.flyTween?.start();
            this.isExplode = true;
            this.sprRocketLine.fillRange = 0;
            this.nodeRocket.active = false;
            this.nodeRocket.eulerAngles = v3(0, 0, this.defaultAngle);
            this.targetPoint.x = this.point1Position.x;
            this.targetPoint.y = this.point1Position.y;
            this.targetPoint.t = 0.1;
        }
    }

    moveBallInBezierCurve() {
        if (this.points.length < 1) {
            return;
        }
        let [p0, p1, p2, p3] = this.points;

        if (this.targetPoint.x >= p3.x) {
            this.playAnim = false;
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

        console.log("targetPoint: ", this.targetPoint);

        const deltaX = Math.abs(xt - this.nodeRocket.position.x);
        const deltaY = Math.abs(yt - this.nodeRocket.position.y);
        const angle = this.defaultAngle + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        console.log("rocket angle: ", angle);
        this.nodeRocket.eulerAngles = v3(0, 0, angle);
        this.updateRocketPosition();
    }

    updateRocketPosition() {
        this.flyTween?.start();
        this.flyTween = tween(this.nodeRocket)
            .to(0.1, { position: v3(this.targetPoint.x, this.targetPoint.y, this.nodeRocket.position.z) }, { easing: "linear" })
            .start();
        // this.rocket.position = v3(this.targetPoint.x, this.targetPoint.y, this.rocket.position.z);
        this.sprRocketLine.fillRange = this.currentMultiplier / this.maxMutiplierFly;
    }

    animate() {
        if (!this.startRound) {
            return;
        }
        this.nodeRocket.active = true;
        this.moveBallInBezierCurve();
    }
}
