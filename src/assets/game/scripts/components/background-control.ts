import gc from "@sg/game-client-base";
import { Node, Tween, UITransform, Vec3, _decorator, tween, v3, log, Color, screen, Vec2, v2, CCInteger } from "cc";
import Observer from "observer";
const { Settlements, GameCrash } = gc;

import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render } = Observer;

export const BG_CLOSING_TRANSITION_DURATION = 2;

@ccclass("background_control")
export class BackgroundControl extends ObserverComponent {
    @property(Node)
    nodeContainerBackground: Node = null;

    @property([Node])
    backgroundNodes: Node[] = [null, null, null];

    @property(CCInteger)
    moveSpeed = 200; //pixel/s

    private isBgMoving = false;
    protected currentBgWidth = 0;
    protected lastDistance = 0;

    onLoad(): void {
        super.onLoad();
        const backgroundCpm = this.backgroundNodes[0]?.getComponent(UITransform);
        backgroundCpm && (this.currentBgWidth = backgroundCpm?.width ?? 0);
    }

    protected update(dt: number): void {
        this.isBgMoving && this.startMovingBackground(dt);
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderBackgroundTime() {
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
        this.lastDistance = 0;
    }

    startMovingBackground(dt: number) {
        const currentContainerX = this.nodeContainerBackground?.position?.x - this.moveSpeed * dt;
        const positiveX = Math.abs(currentContainerX);
        const triggerThreshold = this.currentBgWidth / 2;
        this.nodeContainerBackground?.setPosition(v3(currentContainerX, 0, 0));
        if (positiveX - triggerThreshold > this.currentBgWidth + this.lastDistance) {
            const bgOverflowDistance = positiveX % this.currentBgWidth;
            this.lastDistance = positiveX - bgOverflowDistance;
            const nodes = this.backgroundNodes.filter((node) => node != null);
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

        [this?.nodeContainerBackground, ...this.backgroundNodes].forEach((target) => {
            if (target) {
                Tween.stopAllByTarget(target);
            }
        });

        const resetNode = (node: Node | undefined, position: Vec3, scale: Vec3) => {
            if (!node) {
                return;
            }
            node.position = position;
            node.scale = scale;
        };

        this?.node &&
            tween(this.node)
                .delay(1)
                .call(() => {
                    resetNode(this.nodeContainerBackground, v3(0, 0, 0), v3(1, 1, 1));
                    this.backgroundNodes.forEach((node, index) => {
                        if (!node) return;
                        const xPos = this.currentBgWidth * index;
                        const previousNode = this.backgroundNodes[index - 1];
                        const scaleX = previousNode && previousNode.scale.x === 1 ? -1 : 1; // Middle node is flipped

                        resetNode(node, v3(xPos, node.position.y, 0), v3(scaleX, 1, 1));
                    });
                })
                .start();
    }
}
