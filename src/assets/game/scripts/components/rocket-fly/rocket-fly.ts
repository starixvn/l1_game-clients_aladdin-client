import gc from "@sg/game-client-base";
import { Node, UITransform, Vec3, _decorator, toDegree, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import ColMultipliers from "../col-multipliers/col-multipliers";
import { Rocket, RocketAnim } from "./rocket";

const { ccclass, property } = _decorator;

const { render } = Observer;
@ccclass
export class RocketFly extends ObserverComponent {
    @property(Rocket)
    cpnRocket: Rocket = null;

    @property(UITransform)
    transformRocketTail: UITransform = null;

    @property(Node)
    startPoint: Node = null;

    @property(Node)
    nodeColMultiplier: Node = null;

    private readonly startRotation = -90;
    private grapWidth = 1098;
    private readonly grapMaxX = 9;
    private readonly speedRate = 2;
    private currentMultiplier = 0;
    private deltaTime = 0;
    private isReady = false;
    private firstMultiplierRound = false;
    private flyInterval;
    private receivedMultiplierTimes = 0;
    private cpnColMultipliers: ColMultipliers;
    private prevRocketPosition: Vec3;
    private startPosition: Vec3;

    onLoad() {
        super.onLoad();
        this.isReady = true;
        this.startPosition = this.startPoint.position;
        this.prevRocketPosition = this.startPosition;
        this.cpnRocket.setRocketVisibility(false);
        this.cpnRocket.setExplosionRocketVisibility(false);
        this.cpnRocket.updatePosition(this.startPosition);
        this.cpnColMultipliers = this.nodeColMultiplier.getComponent(ColMultipliers);
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    setTimeByMultiplier(time: number) {
        if (!this.isReady || this.receivedMultiplierTimes > 0) {
            return;
        }

        this.deltaTime = time;
        this.cpnColMultipliers.createDefaultMultiplierList(this.currentMultiplier);
        this.flyRocket(true);
        this.receivedMultiplierTimes += 1;
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.currentMultiplier = multiplier;

        if (this.isReady && !this.firstMultiplierRound) {
            this.cpnRocket.setRocketAnim(RocketAnim.FLY, true);
            this.flyInterval && clearInterval(this.flyInterval);
            this.deltaTime = 0;
            const rocketIntervalTime = 100;
            this.flyInterval = setInterval(() => {
                this.deltaTime += rocketIntervalTime;
                this.animate();
            }, rocketIntervalTime);
            this.firstMultiplierRound = true;
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    private startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }

        this.cpnRocket.node.active = true;
        this.cpnRocket.setRocketAnim(RocketAnim.IDLE, false);
        this.cpnRocket.stopAnimation();
        this.cpnRocket.setRocketVisibility(true);
        this.cpnRocket.setExplosionRocketVisibility(false);
        this.resetStartPosition();
        this.cpnColMultipliers.scrollUp();

        tween(this.cpnRocket.node)
            .call(() => {
                this.cpnRocket.updateRotation(0);
                this.cpnRocket.setSpaceManVisibility(true);
            })
            .delay(2)
            .to(2, { eulerAngles: v3(0, 0, this.startRotation) }, { easing: "sineOut" })
            .delay(2)
            .call(() => {
                this.cpnRocket.setSpaceManVisibility(false);
                this.cpnRocket.setRocketAnim(RocketAnim.START, true);
            })
            .union()
            .start();
    }

    private resetStartPosition() {
        this.updateRocketTail(0);
        this.cpnRocket.updatePosition(this.startPosition);
        this.prevRocketPosition = this.startPosition;
    }

    private animate() {
        if (!this.isReady) {
            return;
        }

        this.flyRocket();
    }

    flyRocket(isJoinInPlaceBetTime = false) {
        this.cpnRocket.setRocketVisibility(true);
        const limitX = this.grapWidth - 50;

        if (this.cpnRocket.node.position.x >= limitX) {
            this.cpnColMultipliers.needScrollDown(this.cpnRocket.nodeRocketHead, this.currentMultiplier);
            return;
        }

        const scale = this.grapWidth / this.grapMaxX;
        let rawX = (this.deltaTime * this.getTimerRate()) / 2000;

        if (isJoinInPlaceBetTime && rawX * scale >= limitX) {
            rawX = limitX / scale;
        }

        let rawY = (0.1 * Math.pow(rawX, 4)) / 190; //equation: 0.1*(x^4)/190
        let newPosition = v3(rawX * scale, rawY * scale);

        const delta = {
            x: newPosition.x - this.prevRocketPosition.x,
            y: newPosition.y - this.prevRocketPosition.y,
        };
        this.updateRocketTail(newPosition.x);
        const eulerAngle = this.startRotation + toDegree(Math.atan2(delta.y, delta.x));
        this.cpnRocket.updateRotation(eulerAngle, true);
        this.cpnRocket.updatePosition(newPosition, true, 0.1);
        this.cpnColMultipliers.needScrollDown(this.cpnRocket.nodeRocketHead, this.currentMultiplier);
        this.prevRocketPosition = newPosition;
    }

    private updateRocketTail(width: number) {
        this.showRocketTail();
        this.transformRocketTail.width = width;
    }

    explodeRocket(isSMall: boolean) {
        if (!this.isReady) {
            return;
        }

        this.hideRocketTail();
        this.flyInterval && clearInterval(this.flyInterval);
        this.firstMultiplierRound = false;
        this.cpnRocket.stopAnimation();
        this.cpnRocket.setRocketVisibility(false);
        this.cpnRocket.setExplosionRocketVisibility(true);
        this.cpnRocket.explode(isSMall);
    }

    private showRocketTail() {
        this.transformRocketTail.node.active = true;
    }

    private hideRocketTail() {
        this.transformRocketTail.node.active = false;
    }

    getTimerRate() {
        const x = this.deltaTime / (2000 * this.grapMaxX);
        return (1 - x) * (1 - x) * this.speedRate + 1;
    }
}
