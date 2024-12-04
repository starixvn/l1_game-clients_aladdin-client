import gc from "@sg/game-client-base";
import { Node, Tween, UITransform, Vec3, _decorator, tween, v3, log, Color } from "cc";
import Observer from "observer";
const { Settlements, GameCrash } = gc;

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render } = Observer;

export const BG_CLOSING_TRANSITION_DURATION = 2;

@ccclass("background_control")
export class BackgroundControl extends ObserverComponent {
    @property(Node)
    nodeContainerBackground: Node = null;

    @property(Node)
    nodeBg1: Node = null;

    @property(Node)
    nodeBg2: Node = null;

    @property({ type: Number })
    moveSpeed = 200; //pixel/s

    private isBgMoving = false;
    protected currentWidth = 1398;
    protected positionUpdateRepeatBg = 0;

    onLoad(): void {
        super.onLoad();
        this.nodeBg1?.getComponent(UITransform) && (this.currentWidth = this.nodeBg1?.getComponent(UITransform)?.width);
    }

    protected update(dt: number): void {
        this.isBgMoving && this.startMovingBackground(dt);
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderPlaneTime(time: number) {
        if (!this.isBgMoving) {
            this.isBgMoving = true;
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound, { fireImmediately: false })
    changeIdleAnim(isStartRound: boolean) {
        isStartRound && this.resetBackground();
    }

    @render(Settlements.SettlementStore, (store) => store.result)
    renderSettle(result) {
        if (!result) {
            return;
        }

        Tween.stopAllByTarget(this.nodeContainerBackground);
        this.isBgMoving = false;
        this.positionUpdateRepeatBg = 0;
    }

    startMovingBackground(dt: number) {
        const currentX = Math.ceil(Math.abs(this.nodeContainerBackground?.position?.x));
        const newX = this.nodeContainerBackground?.position?.x - this.moveSpeed * dt;
        this.nodeContainerBackground?.setPosition(v3(newX, 0, 0));

        if (currentX > this.currentWidth + this.positionUpdateRepeatBg) {
            this.positionUpdateRepeatBg = currentX;
            const offset = currentX - this.positionUpdateRepeatBg;
            if (this.nodeBg1.position.x < this.nodeBg2.position.x) {
                const newX = this.nodeBg2.position.x + this.currentWidth - offset;
                this.nodeBg1.setPosition(v3(newX, this.nodeBg2.position.y, this.nodeBg2.position.z));
            } else {
                const newX = this.nodeBg1.position.x + this.currentWidth - offset;
                this.nodeBg2.setPosition(v3(newX, this.nodeBg1.position.y, this.nodeBg1.position.z));
            }
            log(`Trigger event at currentX: ${currentX}`);
        }
    }

    resetBackground() {
        this.isBgMoving = false;
        Tween.stopAllByTarget(this?.nodeContainerBackground);
        Tween.stopAllByTarget(this?.nodeBg1);
        Tween.stopAllByTarget(this?.nodeBg2);

        tween(this?.node)
            .delay(1)
            .call(() => {
                this.nodeContainerBackground && (this.nodeContainerBackground.position = v3(0, 0, 0));

                if (this.nodeBg1) {
                    this.nodeBg1.position = v3(0, 0, 0);
                    this.nodeBg1.scale = v3(1, 1, 1);
                }

                if (this.nodeBg2) {
                    this.nodeBg2.position = v3(this.currentWidth, 0, 0);
                    this.nodeBg2.scale = v3(-1, 1, 1);
                }
            })
            .start();
    }
}
