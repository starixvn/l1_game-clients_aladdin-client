import gc from "@sg/game-client-base";
import { _decorator, Node, Tween, tween, v3, Vec3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

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

    private readonly smallExplosionMultiplier = 1.02;
    private deltaTime = 0;
    private startedPlaneFlying = false;
    private reachedLimitX = false;
    private preparingPlane = false;
    private tweenDeltaTime: Tween<TweenDeltaTime>;
    private tweenTakeOff: Tween<Node>;
    private readonly durationTakeOff = 1.6;
    private readonly planeTakeOffSound = "plane_takeoff";

    isFirstRun = false;

    private get startPosition(): Vec3 {
        return this.startPoint.position;
    }

    onLoad() {
        this.cpnPlane.updatePosition(this.startPosition);

        super.onLoad();
    }

    onDestroy(): void {
        super.onDestroy();
        this.tweenDeltaTime?.stop();
    }

    @render(gc.Settlements.SettlementStore, (store) => store.result, {
        fireImmediately: false,
    })
    async renderPlaneExplosion(result: gc.GameServiceMessage.TResult) {
        if (result) {
            this.preparingPlane = false;
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

        this.cpnPlane.setPlaneVisibility(true);
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

        if (!this.startedPlaneFlying) {
            if (!this.isEnoughTakeOffTime(time) && this.cpnPlane?.node?.parent) {
                this.cpnPlane.node.position = v3(this.cpnPlane.distanceTakeOff, this.cpnPlane.altitude, 0);
            }

            this.cpnPlane.startFly();

            this.startedPlaneFlying = true;
        }
    }

    private updateDeltaTime(deltaTime: number) {
        this.deltaTime = deltaTime;
        if (!this.reachedLimitX) {
            if (this.isEnoughTakeOffTime(deltaTime)) {
                !this.isFirstRun && this.takeOffLane();
            }
        }
    }

    private isEnoughTakeOffTime(time: number) {
        return this.getTimeInSeconds(time) < this.cpnPlane.durationPlanTakeOff;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.preparingPlane) {
            this.prepareForPlane(false);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }
        this.scheduleOnce(() => {
            this.prepareForPlane(true);
        }, BG_CLOSING_TRANSITION_DURATION / 2);
    }

    private prepareForPlane(animated: boolean) {
        this.preparingPlane = true;
        this.cpnPlane.preparePlane(animated);
        this.cpnPlane.updatePosition(this.startPosition);
        this.resetPlaneContainer();
        this.reachedLimitX = false;
        this.deltaTime = 0;
        this.isFirstRun = false;
    }

    calculatePlanePosition(rawX: number, scale: number) {
        return v3(rawX * scale, 0);
    }

    takeOffLane() {
        this.playPlaneTakeOffSound();
        const plane = this.cpnPlane.node;
        const destPosition = v3(this.cpnPlane.distanceTakeOff, this.cpnPlane.altitude);
        Tween.stopAllByTarget(plane);
        this.tweenTakeOff = tween(plane)
            .parallel(
                tween().to(this.durationTakeOff, { position: destPosition }),
                tween()
                    .to(0.9, { eulerAngles: v3(0, 0, 15) }, { easing: "quadOut" })
                    .to(0.7, { eulerAngles: v3(0, 0, 0) }, { easing: "quadInOut" })
            )
            .start();

        this.isFirstRun = true;
    }

    resetPlaneContainer() {
        const container = this.cpnPlane.node.parent;
        container.position = v3(0, 0);
        container.eulerAngles = v3(0, 0, 0);
    }

    getTimeInSeconds(time: number) {
        return time / 1000;
    }

    explodeRocket() {
        this.tweenDeltaTime?.stop();
        this.tweenTakeOff?.stop();
        this.startedPlaneFlying = false;
        this.cpnPlane.explode();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playPlaneTakeOffSound() {
        return this.planeTakeOffSound;
    }
}
