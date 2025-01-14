import { _decorator, instantiate, log, math, Node, Prefab, sp, tween, v3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { BalanceInfoHandler } from "../balance/balance-info-handler";
import { IWinner, LeaderBoardStore } from "../leader-board/leader-board-store";
import BetWinNotice from "./bet-win-notice";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

enum AnimationNameTree {
    bigWin = "Big win",
    normalWin = "Normal win",
    idle = "idle",
}

enum AnimationNameLeaf {
    win = "Leaf-fall-win",
    idle = "leaf-fall-idle",
}

@ccclass("EffectContainer")
export class EffectContainer extends ObserverComponent {
    @property(sp.Skeleton)
    spineRock: sp.Skeleton = null;

    @property(Prefab)
    prfOtherWinNotice: Prefab = null;

    @property(Prefab)
    prfMainPlayerNotice: Prefab = null;

    @property(Node)
    areaNode: Node = null;

    @property(Node)
    balanceNode: Node = null;

    @property(Node)
    multiplierNode: Node = null;

    container: Node = null;

    // private forceNewAnimation = false;
    // private playerPositions: { [id: string]: number } = {};
    onLoad() {
        this.container = this.node.getChildByName("notice-container");
        //this.resetAnimations();
        super.onLoad();
    }

    @render(LeaderBoardStore, (store) => store.winner, { fireImmediately: false })
    showWinners(winner: IWinner) {
        const { betWin, bigWin, avatarId, name, id } = winner;

        if (betWin <= 0) {
            // this.resetAnimations();
            return;
        }

        // this.playWinAnimations(bigWin, false);

        const encryptedName = this.encryptedName(name);
        // this.showOtherWinnerNotice(id, encryptedName, betWin, avatarId);
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }

    showMainPlayerWinning(data: { betWin: number; bigWin: boolean }) {
        const { betWin, bigWin } = data;
        // this.playWinAnimations(bigWin, true);
        // this.showMainPlayerNotice(betWin);
    }

    // private resetAnimations() {
    //     this.playAnim(this.spineLeaf, AnimationNameLeaf.idle, true);
    //     this.playAnim(this.spineTree, AnimationNameTree.idle, true);
    // }

    // private onAnimationEnd() {
    //     const isLeafPlaying = AnimationUtils.isAnimationPlaying(this.spineLeaf, AnimationNameLeaf.win);
    //     const isTreePlaying =
    //         AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.bigWin) ||
    //         AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.normalWin);

    //     if (isLeafPlaying || isTreePlaying) {
    //         return;
    //     }
    //     this.resetAnimations();
    // }

    // private async playWinAnimations(isBigWin: boolean, forceNew: boolean) {
    //     this.unschedule(this.onAnimationEnd);
    //     const callNewAnimation = this.forceNewAnimation ? false : forceNew;
    //     if (forceNew) {
    //         this.forceNewAnimation = true;
    //     }

    //     if (!AnimationUtils.isAnimationPlaying(this.spineLeaf, AnimationNameLeaf.win) || callNewAnimation) {
    //         this.playAnim(this.spineLeaf, AnimationNameLeaf.win, false);
    //     }

    //     const treeAnimation = isBigWin ? AnimationNameTree.bigWin : AnimationNameTree.normalWin;
    //     const isTreeAnimPlaying =
    //         AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.bigWin) ||
    //         AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.normalWin);

    //     if (!isTreeAnimPlaying || callNewAnimation) {
    //         await this.playAnim(this.spineTree, treeAnimation, false);
    //         this.forceNewAnimation = false;
    //         this.scheduleOnce(this.onAnimationEnd, 0.1);
    //     }
    // }

    // private getRandomWorldPosition(id: string) {
    //     const slots = this.randomArea.children;

    //     if (!this.playerPositions[id]) {
    //         this.playerPositions[id] = math.randomRangeInt(0, slots.length);
    //     }

    //     const randomIndex = this.playerPositions[id];

    //     return slots[randomIndex].worldPosition;
    // }

    // private createNotice(prefab: Prefab) {
    //     const noticeNode = instantiate(prefab);
    //     const notice = noticeNode.getComponent(BetWinNotice);
    //     this.container.addChild(noticeNode);

    //     return notice;
    // }

    // private showMainPlayerNotice(betWin: number) {
    //     const notice = this.createNotice(this.prfMainPlayerNotice);
    //     notice.setBetWin(betWin, false, () => this.flyToBalance(notice.node));
    // }

    // private flyToBalance(node: Node) {
    //     const position = AnimationUtils.getPositionAtDestNode(node, this.balanceNode);

    //     const height = 50;
    //     const startPosition = v3(node.position);
    //     const delta = position.subtract(startPosition);
    //     tween(node)
    //         .to(
    //             0.5,
    //             {
    //                 position,
    //             },
    //             {
    //                 onUpdate: (node, dt: number) => {
    //                     var frac = (dt * 1) % 1.0;
    //                     var y = height * 4 * frac * (1 - frac);
    //                     y += delta.y * dt;
    //                     log("delta y ", y);
    //                     y += startPosition.y;
    //                     log("final y ", y);
    //                     var x = delta.x * dt;
    //                     node.position = v3(x, y, 0);
    //                 },
    //             }
    //         )
    //         .call(() => {
    //             this.updateBalance();
    //             node.destroy();
    //         })
    //         .start();
    // }

    // @handle(BalanceInfoHandler, (handle) => handle.updateBalance())
    // private updateBalance() {}

    // private showOtherWinnerNotice(id: string, name: string, betWin: number, avatarId?: number) {
    //     const notice = this.createNotice(this.prfOtherWinNotice);
    //     const noticeNode = notice.node;

    //     noticeNode.worldPosition = this.getRandomWorldPosition(id);
    //     const updateInfo = () => {
    //         notice.setName(name);
    //         notice.setBetWin(betWin, true, () => {
    //             noticeNode.destroy();
    //         });
    //     };
    //     if (avatarId !== undefined) {
    //         notice.setAvatar(avatarId).then((success) => {
    //             if (success) {
    //                 updateInfo();
    //             } else {
    //                 noticeNode.destroy();
    //             }
    //         });
    //     } else {
    //         updateInfo();
    //     }
    // }

    // async playAnim(spine: sp.Skeleton, animName: string, isLoop: boolean) {
    //     await AnimationUtils.playSpine(spine, animName, isLoop);
    // }

    getDurationAnim(spine: sp.Skeleton, animationName: string) {
        const animation = spine.findAnimation(animationName);
        if (!animation) {
            return 0;
        }

        return animation?.duration ?? 0;
    }
}
