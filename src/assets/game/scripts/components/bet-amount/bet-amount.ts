import { _decorator, Node } from "cc";
import Observer from "observer";
import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game/auto-play/scripts/stores/auto-play-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import gc from "@sg/game-client-base";
import { EarlyBetStore } from "../bet/early-bet-store";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { Bet, Rounds } = gc;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    showHideDisabledNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateDisabledNode(autoPlay: boolean) {
        console.log("updateDisabledNode");
        this.showHideDisabledNode(autoPlay);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    withBetAccepted(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.showHideDisabledNode(true);
        }
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    withEarlyBet(early: boolean) {
        this.showHideDisabledNode(early);
    }

    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    withRocketFly(remaining: number) {
        if (remaining <= 0) {
            this.showHideDisabledNode(false);
        }
    }
}
