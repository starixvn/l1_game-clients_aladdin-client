import gc from "@sg/game-client-base";
import { Node, Tween, _decorator, tween, v3 } from "cc";
import Observer from "observer";
const { Settlements, GameCrash } = gc;

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const AnimationName = {
    PLANETS_IDLE: "idle",
    PLANETS_FLY: "planets",
};

export const BG_CLOSING_TRANSITION_DURATION = 2;

@ccclass("background_control")
export class BackgroundControl extends ObserverComponent {
    @property(Node)
    nodeBackground: Node = null;
    @property(Node)
    nodeTransitionTop: Node = null;
    @property(Node)
    nodeTransitionBottom: Node = null;

    private isBgMoving = false;
    private readonly movingBackgroundDuration = 40;
    private readonly backgroundMoveY = -500;
    private readonly transitionY = 400;

    onLoad() {
        this.resetBackgroundTransition();
        super.onLoad();
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderRocketTime(time: number) {
        if (!this.isBgMoving) {
            this.initNodeBackgroundWithTime(time);
            this.startMovingBackground();
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound, { fireImmediately: false })
    changeIdleAnim(isStartRound) {
        if (isStartRound) {
            this.playBackgroundTransition().then(() => {
                this.resetBackground();
            });
        }
    }

    playTransition(node: Node) {
        const gapTime = 0.1;
        const duration = (BG_CLOSING_TRANSITION_DURATION - gapTime) / 2;
        return new Promise((resolve) => {
            tween(node)
                .to(
                    duration,
                    {
                        position: v3(0, 0, 0),
                    },
                    { easing: "sineOut" }
                )
                .call(resolve)
                .delay(gapTime)
                .to(
                    duration,
                    {
                        position: v3(0, this.transitionY, 0),
                    },
                    { easing: "sineIn" }
                )
                .start();
        });
    }

    resetBackgroundTransition() {
        this.nodeTransitionTop.position = v3(0, this.transitionY, 0);
        this.nodeTransitionBottom.position = v3(0, this.transitionY, 0);
    }

    async playBackgroundTransition() {
        await Promise.all([this.playTransition(this.nodeTransitionTop), this.playTransition(this.nodeTransitionBottom)]);
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    renderSettle() {
        Tween.stopAllByTarget(this.nodeBackground);
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
