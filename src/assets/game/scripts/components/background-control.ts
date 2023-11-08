import gc from "@sg/game-client-base";
import { Node, Tween, _decorator, sp, tween, v3 } from "cc";
import Observer from "observer";
const { Settlements, GameCrash } = gc;

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const AnimationName = {
    PLANETS_IDLE: "idle",
    PLANETS_FLY: "planets",
};

@ccclass("background_control")
export class BackgroundControl extends ObserverComponent {
    @property(Node)
    nodeBackground: Node = null;

    @property(sp.Skeleton)
    planetSkeleton: sp.Skeleton = null;

    private isBgMoving = false;
    private isPlanetsMoving = false;
    private readonly movingBackgroundDuration = 40;
    private readonly backgroundMoveY = -500;

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderRocketTime(time: number) {
        if (!this.isBgMoving) {
            this.initNodeBackgroundWithTime(time);
            this.startMovingBackground();
        }
        // if (!this.isPlanetsMoving) {
        //     this.startPlanetsAnimation();
        // }
    }

    private startPlanetsAnimation() {
        this.isPlanetsMoving = true;
        this.planetSkeleton.timeScale = 1;
        this.planetSkeleton.setAnimation(0, AnimationName.PLANETS_FLY, false);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    changeIdleAnim(isStartRound) {
        if (isStartRound) {
            this.resetBackground();
            this.resetPlanetsAnimation();
        }
    }

    private resetPlanetsAnimation() {
        this.planetSkeleton.timeScale = 1;
        this.planetSkeleton.setAnimation(0, AnimationName.PLANETS_IDLE, true);
        this.isPlanetsMoving = false;
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    renderSettle() {
        Tween.stopAllByTarget(this.nodeBackground);
        this.planetSkeleton.timeScale = 0;
    }

    initNodeBackgroundWithTime(time: number) {
        const rate = time / (this.movingBackgroundDuration * 1000);
        this.nodeBackground.scale = v3(1, 1).multiplyScalar(1 - rate);
        this.nodeBackground.position = v3(0, this.backgroundMoveY * rate);
    }

    startMovingBackground() {
        this.isBgMoving = true;
        tween(this.nodeBackground)
            .to(this.movingBackgroundDuration, {
                scale: v3(0),
                position: v3(0, this.backgroundMoveY),
            })
            .start();
    }

    resetBackground() {
        Tween.stopAllByTarget(this.nodeBackground);
        this.nodeBackground.scale = v3(1, 1, 1);
        this.nodeBackground.position = v3(0);

        this.isBgMoving = false;
    }
}
