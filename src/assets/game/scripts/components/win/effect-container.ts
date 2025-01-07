import { _decorator, instantiate, math, Node, Prefab, sp } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
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
    spineTree: sp.Skeleton = null;

    @property(sp.Skeleton)
    spineLeaf: sp.Skeleton = null;

    @property(Prefab)
    prfOtherWinNotice: Prefab = null;

    @property(Prefab)
    prfMainPlayerNotice: Prefab = null;

    @property(Node)
    randomArea: Node = null;

    container: Node = null;

    private forceNewAnimation = false;

    onLoad() {
        this.container = this.node.getChildByName("notice-container");
        this.resetAnimations();
        super.onLoad();
    }

    @render(LeaderBoardStore, (store) => store.winner, { fireImmediately: false })
    showWinners(winner: IWinner) {
        const { betWin, bigWin, avatarId, name } = winner;

        if (betWin <= 0) {
            this.resetAnimations();
            return;
        }

        this.playWinAnimations(bigWin, false);

        const encryptedName = this.encryptedName(name);
        this.showOtherWinnerNotice(encryptedName, betWin, avatarId);
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }

    showMainPlayerWinning(data: { betWin: number; bigWin: boolean }) {
        const { betWin, bigWin } = data;
        this.playWinAnimations(bigWin, true);
        this.showMainPlayerNotice(betWin);
    }

    private resetAnimations() {
        this.playAnim(this.spineLeaf, AnimationNameLeaf.idle, true);
        this.playAnim(this.spineTree, AnimationNameTree.idle, true);
    }

    private onAnimationEnd() {
        const isLeafPlaying = AnimationUtils.isAnimationPlaying(this.spineLeaf, AnimationNameLeaf.win);
        const isTreePlaying =
            AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.bigWin) ||
            AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.normalWin);

        if (isLeafPlaying || isTreePlaying) {
            return;
        }
        this.resetAnimations();
    }

    private async playWinAnimations(isBigWin: boolean, forceNew: boolean) {
        this.unschedule(this.onAnimationEnd);
        const callNewAnimation = this.forceNewAnimation ? false : forceNew;
        if (forceNew) {
            this.forceNewAnimation = true;
        }

        if (!AnimationUtils.isAnimationPlaying(this.spineLeaf, AnimationNameLeaf.win) || callNewAnimation) {
            this.playAnim(this.spineLeaf, AnimationNameLeaf.win, false);
        }

        const treeAnimation = isBigWin ? AnimationNameTree.bigWin : AnimationNameTree.normalWin;
        const isTreeAnimPlaying =
            AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.bigWin) ||
            AnimationUtils.isAnimationPlaying(this.spineTree, AnimationNameTree.normalWin);

        if (!isTreeAnimPlaying || callNewAnimation) {
            await this.playAnim(this.spineTree, treeAnimation, false);
            this.forceNewAnimation = false;
            this.scheduleOnce(this.onAnimationEnd, 0.1);
        }
    }

    private getRandomWorldPosition() {
        const slots = this.randomArea.children;
        const randomIndex = math.randomRangeInt(0, slots.length);

        return slots[randomIndex].worldPosition;
    }

    private createNotice(prefab: Prefab) {
        const noticeNode = instantiate(prefab);
        const notice = noticeNode.getComponent(BetWinNotice);
        this.container.addChild(noticeNode);

        return notice;
    }

    private showMainPlayerNotice(betWin: number) {
        const notice = this.createNotice(this.prfMainPlayerNotice);
        notice.setBetWin(betWin);
    }

    private showOtherWinnerNotice(name: string, betWin: number, avatarId?: number) {
        const notice = this.createNotice(this.prfOtherWinNotice);
        const noticeNode = notice.node;

        noticeNode.worldPosition = this.getRandomWorldPosition();
        const updateInfo = () => {
            notice.setName(name);
            notice.setBetWin(betWin);
        };
        if (avatarId !== undefined) {
            notice.setAvatar(avatarId).then((success) => {
                if (success) {
                    updateInfo();
                } else {
                    noticeNode.destroy();
                }
            });
        } else {
            updateInfo();
        }
    }

    async playAnim(spine: sp.Skeleton, animName: string, isLoop: boolean) {
        await AnimationUtils.playSpine(spine, animName, isLoop);
    }

    getDurationAnim(spine: sp.Skeleton, animationName: string) {
        const animation = spine.findAnimation(animationName);
        if (!animation) {
            return 0;
        }

        return animation?.duration ?? 0;
    }
}
