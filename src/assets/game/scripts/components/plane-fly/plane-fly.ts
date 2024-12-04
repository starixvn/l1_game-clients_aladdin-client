import gc from "@sg/game-client-base";
import { _decorator, Node, toDegree, Tween, tween, UITransform, v3, Vec3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import ColMultipliers from "../../../../../extensions/shared-components/assets/game-crash/col-multipliers/col-multipliers";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { BG_CLOSING_TRANSITION_DURATION } from "../background-control";
import { Plane } from "./plane";

const { ccclass, property } = _decorator;

const { handle, render } = Observer;
const { GameCrash } = gc;

type TweenDeltaTime = {
    deltaTime: number;
};

@ccclass
export class PlaneFly extends ObserverComponent {
    @property(Plane)
    cpnPlane: Plane = null;

    @property(Node)
    startPoint: Node = null;

    @property
    maxHeight = 0;

    private readonly startRotation = 0;
    private readonly graphWidth = 500;
    private readonly graphMaxX = 32;
    private readonly rawLimitX = 30;
    private readonly graphScale = this.graphWidth / this.graphMaxX;
    private readonly smallExplosionMultiplier = 1.02;
    private readonly graphTranslateDuration = this.rawLimitX * 1000;
    private deltaTime = 0;
    private startedRocketFlying = false;
    private reachedLimitX = false;
    private preparingRocket = false;
    private tweenDeltaTime: Tween<TweenDeltaTime>;
    private readonly durationTakeOff = 1.6;

    isFirstRun = false;

    private get startPosition(): Vec3 {
        return this.startPoint.position;
    }

    onLoad() {
        this.cpnPlane.updatePosition(this.startPosition, false);

        super.onLoad();
    }

    onDestroy(): void {
        super.onDestroy();
        this.tweenDeltaTime?.stop();
    }

    @render(gc.Settlements.SettlementStore, (store) => store.result, {
        fireImmediately: false,
    })
    async renderRocketExplosion(result: gc.GameServiceMessage.TResult) {
        if (result) {
            this.preparingRocket = false;
            +result < this.smallExplosionMultiplier && (await AnimationUtils.delayTime(0.5));
            this.updateIsCrashed();
            this.explodeRocket();
        }
    }

    @handle(GameCrash.CrashMultiplier.MultiplierHandlers, (handle, crashed: string) => handle.handleRocketState(crashed))
    updateIsCrashed() {
        return GameCrash.RocketState.CRASHED;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    setTimeByMultiplier(time: number) {
        if (time - this.deltaTime > 150) {
            const timePoint = time - 100;
            this.updateDeltaTime(timePoint);
        }

        console.log("time: ", time);

        this.cpnPlane.setRocketVisibility(true);
        const tweenObject = {
            deltaTime: this.deltaTime,
        };
        this.tweenDeltaTime?.stop();
        this.tweenDeltaTime = tween(tweenObject)
            .to(
                0.1,
                {
                    deltaTime: time,
                },
                {
                    onUpdate: () => {
                        this.node.isValid && this.updateDeltaTime(tweenObject.deltaTime);
                    },
                }
            )
            .start();

        if (!this.startedRocketFlying) {
            this.cpnPlane.startFly(time);

            this.startedRocketFlying = true;
        }
    }

    private updateDeltaTime(deltaTime: number) {
        this.deltaTime = deltaTime;
        if (!this.reachedLimitX) {
            this.flyRocket(this.deltaTime, false);
            if (deltaTime < this.cpnPlane.durationPlanTakeOff) {
                !this.isFirstRun && this.movingRocketContainer();
            }
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.preparingRocket) {
            this.prepareForRocket(false);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }
        this.scheduleOnce(() => {
            this.prepareForRocket(true);
        }, BG_CLOSING_TRANSITION_DURATION / 2);
    }

    private prepareForRocket(animated: boolean) {
        this.preparingRocket = true;
        this.cpnPlane.prepareRocket(this.startRotation, animated);
        this.cpnPlane.updatePosition(this.startPosition);
        this.resetRocketContainer();
        this.reachedLimitX = false;
        this.deltaTime = 0;
        this.isFirstRun = false;
    }

    calculateRocketPosition(rawX: number, scale: number) {
        const rawY = this.calculateMultiplier(rawX) - 1;
        return v3(rawX * scale, 0);
    }

    calculateMultiplier(time: number) {
        const a = 0.04;
        const b = 0.66;
        const c = 1 - Math.pow(b, 5);
        return Math.pow(a * time + b, 5) + c;
    }

    movingRocketContainer() {
        const container = this.cpnPlane.node.parent;
        const destPosition = v3(200, 185);

        Tween.stopAllByTarget(container);
        tween(container)
            .parallel(
                tween().to(this.durationTakeOff, { position: destPosition }),
                tween()
                    .to(1.4, { eulerAngles: v3(0, 0, 17) }, { easing: "quadOut" })
                    .to(0.2, { eulerAngles: v3(0, 0, 0) }, { easing: "quadInOut" })
            )
            .start();

        this.isFirstRun = true;
    }

    resetRocketContainer() {
        const container = this.cpnPlane.node.parent;
        container.position = v3(0, 0);
        container.eulerAngles = v3(0, 0, 0);
    }

    getTimeInSeconds(time: number) {
        return time / 1000;
    }

    async flyRocket(time: number, animated = true) {
        const scale = this.graphScale;
        const rawLimitX = this.rawLimitX;
        let rawX = this.getTimeInSeconds(time) * this.getTimerRate();
        if (rawX >= rawLimitX) {
            rawX = rawLimitX;
            this.reachedLimitX = true;
        }
        const newPosition = this.calculateRocketPosition(rawX, scale);
        const prevRocketPosition = this.calculateRocketPosition(rawX - 0.1, scale);
        const delta = {
            x: newPosition.x - prevRocketPosition.x,
            y: 0,
        };

        const eulerAngle = this.startRotation + toDegree(Math.atan2(delta.y, delta.x));
        this.cpnPlane.updateRotation(eulerAngle, animated);
        this.cpnPlane.updatePosition(newPosition, animated);
    }

    explodeRocket() {
        this.tweenDeltaTime?.stop();
        this.startedRocketFlying = false;
        this.cpnPlane.explode();
    }

    getTimerRate() {
        const x = Math.min(1, this.deltaTime / this.graphTranslateDuration);
        return Math.pow(1 - x, 2) + 1;
    }
}
