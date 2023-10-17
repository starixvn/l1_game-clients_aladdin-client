import gc from "@sg/game-client-base";
import { _decorator, Node, sp, Tween, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

const { render, handle } = Observer;
@ccclass
export class RocketFly2 extends ObserverComponent {
    @property(Node)
    nodeRocketContainer: Node = null;

    @property(Node)
    nodeRocket: Node = null;

    // @property(Sprite)
    // sprRocketLine: Sprite = null;

    // @property(SpriteFrame)
    // fraLevel1Line: SpriteFrame = null;

    // @property(SpriteFrame)
    // fraLevel2Line: SpriteFrame = null;

    // @property(SpriteFrame)
    // fraLevel3Line: SpriteFrame = null;

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
    maxMutiplierFly = 10;
    maxMutiplierFlyTemp = this.maxMutiplierFly;
    currentMultiplier = 0;
    linePercent = 0;
    dataServerReturnTime = 0.1;
    yMax = 449;
    xMax = 1098;
    isReady = false;
    firstMultiplierRound = false;
    angleTween: Tween<Node>;
    flyTween: Tween<Node>;
    explositionTween: Tween<Node>;
    skeRocket: sp.Skeleton;
    timeByMultiplier = 0;

    onLoad() {
        super.onLoad();
        this.isReady = true;
        this.nodeRocket.active = false;
        this.skeExplosion.node.active = false;
        // this.updateRocketLine(0);
        this.skeRocket = this.nodeRocket.getComponent(sp.Skeleton);

        this.point1Position = this.nodePoint1.position;
        this.point2Position = this.nodePoint2.position;
        this.point3Position = this.nodePoint3.position;
        this.point4Position = this.nodePoint4.position;

        this.targetPoint = { x: this.point1Position.x, y: this.point1Position.y, speed: 0.5, t: this.dataServerReturnTime };
        //Define the bezier curve movement of the rocket
        this.points = [
            { x: this.targetPoint.x, y: this.targetPoint.y },
            { x: this.point2Position.x, y: this.point2Position.y },
            { x: this.point3Position.x, y: this.point3Position.y },
            { x: this.point4Position.x, y: this.point4Position.y },
        ];
        this.updateRocketPosition(this.point1Position);
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    setTimeByMultiplier(time: number) {
        this.timeByMultiplier = time / 1000;
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        console.log("multiplier: ", multiplier);

        if (!this.firstMultiplierRound) {
            this.skeRocket.setAnimation(1, "rocket-fly", true);
        }

        this.firstMultiplierRound = true;
        this.currentMultiplier = multiplier;

        this.animate();

        // let fraLine: SpriteFrame;
        // if (multiplier <= this.level1Multiplier) {
        //     fraLine = this.fraLevel1Line;
        // } else if (multiplier <= this.level2Multiplier) {
        //     fraLine = this.fraLevel2Line;
        // } else {
        //     fraLine = this.fraLevel3Line;
        // }

        // this.sprRocketLine.spriteFrame = fraLine;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    private startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }
        console.log("-----start game----");
        this.explositionTween?.stop();
        this.nodeRocketContainer.active = true;
        this.setRocketVisibility(true);
        this.resetStartPosition();
        this.maxMutiplierFlyTemp = this.maxMutiplierFly;
        this.updateRocketAngle(0);

        this.skeRocket.setAnimation(0, "rocket-idle", false);
        tween(this.nodeRocketContainer)
            .to(2, { eulerAngles: v3(0, 0, this.defaultAngle) }, { easing: "sineOut" })
            .call(() => {
                this.skeRocket.setAnimation(0, "rocket-start", true);
            })
            .start();
    }

    private setRocketVisibility(status: boolean) {
        this.skeExplosion.node.active = !status;
        this.nodeRocket.active = status;
    }

    private updateRocketLine(value: number) {
        // this.sprRocketLine.fillRange = value;
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

    private updateRocketPosition(targetPoint, isAnimated = false) {
        if (isAnimated) {
            this.flyTween?.stop();
            this.flyTween = tween(this.nodeRocketContainer)
                .to(0.1, { position: v3(targetPoint.x, targetPoint.y, this.nodeRocketContainer.position.z) }, { easing: "linear" })
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
        this.targetPoint.t = this.dataServerReturnTime;
    }

    private animate() {
        if (!this.isReady || this.nodeRocketContainer.position.x > this.xMax) {
            return;
        }
        this.nodeRocket.active = true;
        // this.moveBallInBezierCurve();
        const y = this.yMax * (this.currentMultiplier / this.maxMutiplierFly);
        const x = this.timeByMultiplier * (this.xMax / 5) * 0.5;
        this.targetPoint.x = x;
        this.targetPoint.y = y;
        console.log(this.targetPoint);

        const deltaX = Math.abs(x - this.nodeRocketContainer.position.x);
        const deltaY = Math.abs(y - this.nodeRocketContainer.position.y);
        const angle = this.defaultAngle + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        this.updateRocketAngle(angle, false);
        this.updateRocketPosition(this.targetPoint, true);
        // this.updateRocketLine(this.currentMultiplier / this.maxMutiplierFlyTemp);
    }

    explodeRocket(isSMall: boolean) {
        if (!this.isReady) {
            return;
        }
        this.flyTween?.stop();
        this.angleTween?.stop();
        this.explositionTween?.stop();
        this.setRocketVisibility(false);
        // this.updateRocketLine(0);
        this.firstMultiplierRound = false;

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
