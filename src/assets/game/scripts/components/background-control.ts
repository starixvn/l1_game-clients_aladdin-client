import gc from "@sg/game-client-base";
import { Node, Tween, UITransform, Vec3, _decorator, tween, v3, log, Color, screen, Vec2, v2 } from "cc";
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

    @property(Node)
    nodeBg3: Node = null;

    @property({ type: Number })
    moveSpeed = 200; //pixel/s

    private isBgMoving = false;
    protected currentBgWidth = 0;
    protected lastCompletedScrollDistance = 0;

    onLoad(): void {
        super.onLoad();
        this.nodeBg1?.getComponent(UITransform) && (this.currentBgWidth = this.nodeBg1?.getComponent(UITransform)?.width);
    }

    protected update(dt: number): void {
        this.isBgMoving && this.startMovingBackground(dt);
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderBackgroundTime(time: number) {
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
        this.lastCompletedScrollDistance = 0;
    }

    startMovingBackground(dt: number) {
        const currentContainerX = this.nodeContainerBackground?.position?.x - this.moveSpeed * dt;
        const positiveX = Math.abs(currentContainerX);
        const triggerThreshold = this.currentBgWidth / 2;
        this.nodeContainerBackground?.setPosition(v3(currentContainerX, 0, 0));
        if (positiveX - triggerThreshold > this.currentBgWidth + this.lastCompletedScrollDistance) {
            const bgOverflowDistance = positiveX % this.currentBgWidth;
            this.lastCompletedScrollDistance = positiveX - bgOverflowDistance;
            const nodes = [this.nodeBg1, this.nodeBg2, this.nodeBg3].filter((node) => node != null);
            nodes.sort((a, b) => a.position.x - b.position.x);
            const leftmostNode = nodes[0];
            const rightmostNode = nodes[nodes.length - 1];
            const scaleXMiddle = rightmostNode?.scale?.x;
            let scaleNewX = -scaleXMiddle;

            // Move leftmost node to the right of the rightmost node
            const newX = rightmostNode.position.x + this.currentBgWidth;
            if (leftmostNode && newX > 0) {
                leftmostNode.setPosition(v3(newX, rightmostNode.position.y, rightmostNode.position.z));
                leftmostNode.scale = v3(scaleNewX, 1, 1);
            }

            console.log(`Trigger event at positiveX: ${positiveX} `);
        }
    }

    resetBackground() {
        this.isBgMoving = false;

        [this?.nodeContainerBackground, this?.nodeBg1, this?.nodeBg2, this?.nodeBg3].forEach((target) => {
            if (target) {
                Tween.stopAllByTarget(target);
            }
        });

        const resetNode = (node: Node | undefined, position: Vec3, scale: Vec3) => {
            if (!node) return;
            node.position = position;
            node.scale = scale;
        };

        tween(this?.node)
            .delay(1)
            .call(() => {
                resetNode(this.nodeContainerBackground, v3(0, 0, 0), v3(1, 1, 1));
                resetNode(this.nodeBg1, v3(0, this.nodeBg1.position.y, 0), v3(1, 1, 1));
                resetNode(this.nodeBg2, v3(this.currentBgWidth, this.nodeBg2.position.y, 0), v3(-1, 1, 1));
                resetNode(this.nodeBg3, v3(this.currentBgWidth * 2, this.nodeBg3.position.y, 0), v3(1, 1, 1));
            })
            .start();
    }
}
