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

    @property(Color)
    mainBackgroundColor: Color = new Color("010386");

    private isBgMoving = false;
    private isResetBg = false;
    protected currentWidth = 1398;
    protected positionUpdateRepeatBg = 0;

    onLoad(): void {
        super.onLoad();
        this.currentWidth = this.nodeBg1?.getComponent(UITransform)?.width;
    }

    protected update(dt: number): void {
        this.isBgMoving && this.startMovingBackground(dt);
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderRocketTime(time: number) {
        if (!this.isBgMoving) {
            this.isBgMoving = true;
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound, { fireImmediately: false })
    changeIdleAnim(isStartRound: boolean) {
        if (isStartRound) {
            this.resetBackground();
        }
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
        Tween.stopAllByTarget(this.nodeContainerBackground);
        let lastUpdateX = Math.abs(this.nodeContainerBackground?.position?.x);
        tween(this.nodeContainerBackground)
            .to(
                1,
                { scale: v3(1, 1, 1), position: v3(0, 0, 0) },
                {
                    easing: "sineIn",
                    onUpdate: () => {
                        const currentX = Math.abs(this.nodeContainerBackground?.position?.x);
                        console.log("currentX", currentX);

                        if (Math.abs(lastUpdateX - currentX) >= this.currentWidth) {
                            // Chỉ cập nhật khi giá trị X thay đổi đủ lớn
                            if (this.nodeBg1?.position?.x > this.nodeBg2?.position?.x) {
                                const newX = this.nodeBg1?.position?.x - this.currentWidth;
                                this.nodeBg2?.setPosition(v3(newX, this.nodeBg1.position.y, this.nodeBg1.position.z));
                            } else {
                                const newX = this.nodeBg2?.position?.x - this.currentWidth;
                                this.nodeBg1?.setPosition(v3(newX, this.nodeBg2.position.y, this.nodeBg2.position.z));
                            }
                            console.log("resetBackground", currentX);

                            // Cập nhật giá trị lastUpdateX
                            lastUpdateX = currentX;
                        }

                        if (currentX < 20) {
                            this.nodeBg1 && (this.nodeBg1.position = v3(0, 0, 0));
                            this.nodeBg2 && (this.nodeBg2.position = v3(this.currentWidth, 0, 0));
                        }
                    },
                }
            )

            .start();
    }
}
