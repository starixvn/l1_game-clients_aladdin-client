import gc from "@sg/game-client-base";
import { _decorator, Node, sp, Sprite, SpriteFrame, Tween, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

const { render, handle } = Observer;
@ccclass
export class RocketFly extends ObserverComponent {
    @property(Node)
    nodeRocketContainer: Node = null;

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

    point1Position = v3(0, 0, 0);
    point2Position = v3(0, 0, 0);
    point3Position = v3(0, 0, 0);
    point4Position = v3(0, 0, 0);
    defaultAngle = -90;
    level1Multiplier = 5;
    level2Multiplier = 10;
    targetPoint;
    points = [];
    maxMutiplierFly = 4;
    currentMultiplier = 0;
    linePercent = 0;
    isReady = false;
    flyTween: Tween<Node>;
    explositionTween: Tween<Node>;

    onLoad() {
        super.onLoad();
        this.isReady = true;
        this.nodeRocket.active = false;
        this.skeExplosion.node.active = false;
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
    private setCurrentMultiplier(multiplier: number) {
        console.log("multiplier: ", multiplier);
        const multiplierTemp = multiplier - 1;
        this.currentMultiplier = multiplierTemp;

        if (multiplierTemp > 3 && multiplierTemp < 4.5) {
            this.maxMutiplierFly = 4.5;
            console.log("maxMutiplierFly1: ", this.maxMutiplierFly);
        }

        if (multiplierTemp > 4.5 && multiplierTemp < 5.5) {
            this.maxMutiplierFly = 5;
            console.log("maxMutiplierFly2: ", this.maxMutiplierFly);
        }

        if (multiplierTemp > 5.5 && multiplierTemp < 6) {
            this.maxMutiplierFly = 5.5;
            console.log("maxMutiplierFly3: ", this.maxMutiplierFly);
        }

        if (multiplierTemp > 6 && multiplierTemp < 6.5) {
            this.maxMutiplierFly = 6;
            console.log("maxMutiplierFly4: ", this.maxMutiplierFly);
        }

        if (multiplierTemp > 6.5) {
            this.maxMutiplierFly = 7;
        }

        this.animate();

        let fraLine: SpriteFrame;
        if (multiplier <= this.level1Multiplier) {
            fraLine = this.fraLevel1Line;
        } else if (multiplier <= this.level2Multiplier) {
            fraLine = this.fraLevel2Line;
        } else {
            fraLine = this.fraLevel3Line;
        }

        this.sprRocketLine.spriteFrame = fraLine;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        if (isStartRound) {
            console.log("-----start game----");
            this.explositionTween?.stop();
            this.nodeRocketContainer.active = isStartRound;
            this.skeExplosion.node.active = !isStartRound;
            this.nodeRocket.active = isStartRound;
            this.nodeRocketContainer.position = v3(this.point1Position.x, this.point1Position.y, this.nodeRocketContainer.position.z);
            this.nodeRocketContainer.eulerAngles = v3(0, 0, this.defaultAngle);
            this.targetPoint.x = this.point1Position.x;
            this.targetPoint.y = this.point1Position.y;
            this.targetPoint.t = 0.1;
        }
    }

    private moveBallInBezierCurve() {
        if (!this.isReady) {
            return;
        }
        let [p0, p1, p2, p3] = this.points;

        if (this.targetPoint.x >= p3.x) {
            return;
        }

        //Calculate the coefficients based on where the rocket currently is in the animation
        let cx = 3 * (p1.x - p0.x);
        let bx = 3 * (p2.x - p1.x) - cx;
        let ax = p3.x - p0.x - cx - bx;

        let cy = 3 * (p1.y - p0.y);
        let by = 3 * (p2.y - p1.y) - cy;
        let ay = p3.y - p0.y - cy - by;

        let t = this.currentMultiplier / this.maxMutiplierFly;

        //Increment t value by speed
        this.targetPoint.t += this.targetPoint.speed;
        //Calculate new X & Y positions of rocket
        let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
        let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

        //We draw the rocket to the canvas in the new location
        this.targetPoint.x = xt;
        this.targetPoint.y = yt;

        const deltaX = Math.abs(xt - this.nodeRocketContainer.position.x);
        const deltaY = Math.abs(yt - this.nodeRocketContainer.position.y);
        const angle = this.defaultAngle + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        console.log("rocket angle: ", angle);
        this.nodeRocketContainer.eulerAngles = v3(0, 0, angle);
        this.updateRocketPosition();
    }

    private updateRocketPosition() {
        this.flyTween?.stop();
        this.flyTween = tween(this.nodeRocketContainer)
            .to(0.1, { position: v3(this.targetPoint.x, this.targetPoint.y, this.nodeRocketContainer.position.z) }, { easing: "linear" })
            .start();
        this.sprRocketLine.fillRange = this.currentMultiplier / this.maxMutiplierFly;
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
        this.flyTween?.stop();
        this.explositionTween?.stop();
        this.nodeRocket.active = false;
        this.sprRocketLine.fillRange = 0;

        const animName = isSMall ? "explosion-small" : "explosion-big";
        const duration = this.skeExplosion.findAnimation(animName).duration;

        this.skeExplosion.node.active = true;
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
