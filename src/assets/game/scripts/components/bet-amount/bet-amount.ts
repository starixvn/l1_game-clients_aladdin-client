import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetStore } from "../bet/early-bet-store";
import { PlayerActionStore } from "../player-actions/player-action-store";

const { ccclass, property } = _decorator;
const { render } = Observer;
const { Bet, Rounds } = gc;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    private placeBetTime = false;

    showHideDisabledNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateDisabledNode(autoPlay: boolean) {
        this.showHideDisabledNode(autoPlay);
    }

    @render(Bet.BetStore, (store) => store.isReceivedBet)
    withBetAccepted(isReceivedBet: boolean) {
        this.showHideDisabledNode(isReceivedBet);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    setTimePlaceBet(isPlacingBet: boolean) {
        this.placeBetTime = isPlacingBet;
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    withEarlyBet(early: boolean) {
        if (!this.placeBetTime) {
            this.showHideDisabledNode(early);
        }
    }

    @render(PlayerActionStore, (store) => ({
        rocketFlyWithoutCashout: store.rocketFlyWithoutCashout,
        showPlaceBetNextRound: store.showPlaceBetNextRound,
        isWaitingBet: store.waitingBet,
    }))
    showPlaceBetNextRound(data: { rocketFlyWithoutCashout: boolean; showPlaceBetNextRound: boolean; isWaitingBet: boolean }) {
        const { rocketFlyWithoutCashout, showPlaceBetNextRound, isWaitingBet } = data;
        if (rocketFlyWithoutCashout || (showPlaceBetNextRound && !isWaitingBet)) {
            this.showHideDisabledNode(false);
        }
    }
}
