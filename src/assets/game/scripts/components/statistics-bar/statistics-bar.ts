import gc from "@sg/game-client-base";
import { Label, Node, Prefab, Sprite, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { StatisticsButton } from "./statistics-button";
const { ccclass, property } = _decorator;
const { render } = Observer;

export interface CrashRoundHistory extends gc.RoundHistories.RoundHistory {
    md5Result: any;
}

@ccclass
export class StatisticsBar extends ObserverComponent {
    @property(Prefab)
    prbStatisticsItem: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Label)
    lblCountdown: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Sprite)
    sprCurrentRound: Sprite = null;

    protected rounds: CrashRoundHistory[] = [];

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    setRoundsInfo(rounds: CrashRoundHistory[]) {
        this.rounds = [...rounds];
        this.updateStatisticsBarInfo(this.rounds);
    }

    private updateStatisticsBarInfo(rounds: CrashRoundHistory[]) {
        if (this.rounds.length === 0) {
            return;
        }
        this.content.destroyAllChildren();
        rounds.forEach((round, index) => {
            if (index < 1) {
                return;
            }
            const node = instantiate(this.prbStatisticsItem);
            const control = node.getComponent(StatisticsButton);
            control.setData(round);
            this.content.addChild(node);
        });
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.remaining)
    showHideLabelText(remaining: number) {
        if (remaining === 0) {
            this.showHideNode(false, false, true);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => ({
        countdownTimer: store.countdownTimer,
        isPlacingBet: store.isPlacingBet,
        isLockingBet: store.isLocking,
    }))
    updateLabelText({
        countdownTimer,
        isPlacingBet,
        isLockingBet,
    }: {
        countdownTimer: number;
        isPlacingBet: boolean;
        isLockingBet: boolean;
    }) {
        if (countdownTimer < 11 && countdownTimer > 0 && (isPlacingBet || isLockingBet)) {
            this.updateCountDownValue(countdownTimer);
        }
    }

    showHideNode(isShowMultiplier: boolean, isShowCountDown: boolean, isShowSprInPlay: boolean) {
        this.lblMultiplier.node.active = isShowMultiplier;
        this.lblCountdown.node.active = isShowCountDown;
        this.sprCurrentRound.node.active = isShowSprInPlay;
    }

    updateCountDownValue(value: number) {
        this.lblCountdown.string = `${value}s`;
        this.showHideNode(false, true, false);
    }

    updateMultiplierValue(value: number) {
        this.lblMultiplier.string = `${value}x`;
        this.showHideNode(true, false, false);
    }
}
