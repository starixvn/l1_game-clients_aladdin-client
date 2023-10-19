import gc from "@sg/game-client-base";
import { _decorator, Node, sp, Tween, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import ColMultipliers from "./col-multipliers/col-multipliers";

const { ccclass, property } = _decorator;

const { render, handle } = Observer;
@ccclass
export class RocketFly extends ObserverComponent {
    @property(Node)
    nodeRocketContainer: Node = null;

    @property(Node)
    nodeRocket: Node = null;

    @property(Node)
    nodeRocketLine: Node = null;

    @property(sp.Skeleton)
    skeExplosion: sp.Skeleton = null;

    @property(Node)
    nodePoint1: Node = null;

    @property(Node)
    nodePoint2: Node = null;

    @property(Node)
    nodePoint3: Node = null;

    @property(Node)
    nodePoint4: Node = null;

    @property(Node)
    nodeColMultiplier: Node = null;

    private point1Position = v3(0, 0, 0);
    private point2Position = v3(0, 0, 0);
    private point3Position = v3(0, 0, 0);
    private point4Position = v3(0, 0, 0);
    private defaultAngle = -90;
    private level1Multiplier = 5;
    private level2Multiplier = 10;
    private targetPoint: { x: number; y: number; acc: number; v: number };
    private points = [];
    private linePercent = 0;
    private defaultV = 0.04;
    private defaultAcc = 0.4;
    private rocketIntervalTime = 100;
    private deltaTime = 0;
    private isReady = false;
    private firstMultiplierRound = false;
    private angleTween: Tween<Node>;
    private flyTween: Tween<Node>;
    private explositionTween: Tween<Node>;
    private skeRocket: sp.Skeleton;
    private timeByMultiplier = 0;
    private flyInterval;
    private receivedMultiplierTimes = 0;
    private cpnColMultipliers: ColMultipliers;

    onLoad() {
        super.onLoad();
        this.isReady = true;
        this.nodeRocket.active = false;
        this.skeExplosion.node.active = false;
        this.nodeRocketLine.active = false;
        this.skeRocket = this.nodeRocket.getComponent(sp.Skeleton);
        this.cpnColMultipliers = this.nodeColMultiplier.getComponent(ColMultipliers);

        this.point1Position = this.nodePoint1.position;
        this.point2Position = this.nodePoint2.position;
        this.point3Position = this.nodePoint3.position;
        this.point4Position = this.nodePoint4.position;

        this.targetPoint = { x: this.point1Position.x, y: this.point1Position.y, acc: this.defaultAcc, v: this.defaultV };
        //Define the bezier curve movement of the rocket
        this.points = [
            { x: this.targetPoint.x, y: this.targetPoint.y },
            { x: this.point2Position.x, y: this.point2Position.y },
            { x: this.point3Position.x, y: this.point3Position.y },
            { x: this.point4Position.x, y: this.point4Position.y },
        ];
        this.updateRocketPosition(this.point1Position);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStaringLocking)
    rotateRocketWhenStart(isStaringLocking: boolean) {
        if (isStaringLocking) {
            tween(this.nodeRocketContainer)
                .to(1, { eulerAngles: v3(0, 0, this.defaultAngle) }, { easing: "sineOut" })
                .call(() => {
                    this.skeRocket.setAnimation(0, "rocket-start", true);
                })
                .start();
        }
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    setTimeByMultiplier(time: number) {
        if (!this.isReady || this.receivedMultiplierTimes > 0) {
            return;
        }

        this.deltaTime = time;
        this.receivedMultiplierTimes += 1;
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        if (!this.firstMultiplierRound) {
            this.skeRocket.setAnimation(1, "rocket-fly", true);
            this.cpnColMultipliers.startScrollDown();
            this.flyInterval && clearInterval(this.flyInterval);
            this.flyInterval = setInterval(() => {
                this.deltaTime += this.rocketIntervalTime;
                this.animate();
            }, this.rocketIntervalTime);
        }

        this.firstMultiplierRound = true;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    private startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }

        this.explositionTween?.stop();
        this.nodeRocketContainer.active = true;
        this.nodeRocketLine.active = false;
        this.setRocketVisibility(true);
        this.resetStartPosition();
        this.updateRocketAngle(0);
        this.cpnColMultipliers.initDefaultMultiplier();

        this.skeRocket.setAnimation(0, "rocket-idle", false);
    }

    private setRocketVisibility(status: boolean) {
        this.skeExplosion.node.active = !status;
        this.nodeRocket.active = status;
    }

    private updateRocketAngle(angle: number, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.angleTween?.stop();
            this.angleTween = tween(this.nodeRocketContainer)
                .to(duration, { eulerAngles: v3(0, 0, angle) }, { easing: "linear" })
                .start();
        } else {
            this.nodeRocketContainer.eulerAngles = v3(0, 0, angle);
        }
    }

    private updateRocketPosition(targetPoint, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.flyTween?.stop();
            this.flyTween = tween(this.nodeRocketContainer)
                .to(duration, { position: v3(targetPoint.x, targetPoint.y, this.nodeRocketContainer.position.z) }, { easing: "linear" })
                .start();
        } else {
            this.nodeRocketContainer.position = v3(targetPoint.x, targetPoint.y, this.nodeRocketContainer.position.z);
        }
    }

    private resetStartPosition() {
        this.updateRocketPosition(this.point1Position);
        this.nodeRocketContainer.position = v3(this.point1Position.x, this.point1Position.y, this.nodeRocketContainer.position.z);

        this.targetPoint.x = this.point1Position.x;
        this.targetPoint.y = this.point1Position.y;
        this.targetPoint.v = this.defaultV;
        this.targetPoint.acc = this.defaultAcc;
        this.deltaTime = 0;
    }

    private moveBallInBezierCurve() {
        let [p0, p1, p2, p3] = this.points;

        if (this.targetPoint.x >= p3.x - 10) {
            this.flyInterval && clearInterval(this.flyInterval);
            return;
        }

        //Calculate the coefficients based on where the rocket currently is in the animation
        let cx = 3 * (p1.x - p0.x);
        let bx = 3 * (p2.x - p1.x) - cx;
        let ax = p3.x - p0.x - cx - bx;

        let cy = 3 * (p1.y - p0.y);
        let by = 3 * (p2.y - p1.y) - cy;
        let ay = p3.y - p0.y - cy - by;

        let t = this.targetPoint.v;

        const times = this.deltaTime / this.rocketIntervalTime;
        this.targetPoint.acc = this.defaultAcc + (times * (this.calculateDecreaseTime(this.deltaTime / 1000) * this.deltaTime)) / 1000;
        this.targetPoint.v = this.defaultV + (times * (this.targetPoint.acc * this.defaultV * this.deltaTime)) / 1000;

        //Calculate new X & Y positions of rocket
        let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
        let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

        //We draw the rocket to the canvas in the new location
        this.targetPoint.x = xt;
        this.targetPoint.y = yt;

        const deltaX = Math.abs(xt - this.nodeRocketContainer.position.x);
        const deltaY = Math.abs(yt - this.nodeRocketContainer.position.y);
        const angle = this.defaultAngle + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        this.updateRocketAngle(angle, true, this.rocketIntervalTime / 1000);
        this.updateRocketPosition(this.targetPoint, true, this.rocketIntervalTime / 1000);
    }

    private calculateDecreaseTime(t: number) {
        return 0.0025;
        // console.log("Math.sqr", 1 - --t * t);
        // const time = Math.sqrt(1 - --t * t) / 10;
        // console.log("calculateDecreaseTime", time);
        // return time;
    }

    private animate() {
        if (!this.isReady) {
            return;
        }
        this.nodeRocket.active = true;
        this.moveBallInBezierCurve();
    }

    explodeRocket(isSMall: boolean) {
        if (!this.isReady) {
            return;
        }
        this.flyInterval && clearInterval(this.flyInterval);
        this.flyTween?.stop();
        this.angleTween?.stop();
        this.explositionTween?.stop();
        this.setRocketVisibility(false);
        this.nodeRocketLine.active = false;
        this.firstMultiplierRound = false;
        this.cpnColMultipliers.stopScrollDown();

        const animName = isSMall ? "explosion-small" : "explosion-big";
        const duration = this.skeExplosion.findAnimation(animName).duration;
        this.skeExplosion.setAnimation(0, animName, false);
        this.explositionTween = tween(this.nodeRocketContainer)
            .delay(duration)
            .call(() => {
                console.log("hide explosion");
                this.skeExplosion.node.active = false;
            })
            .start();
    }
}
