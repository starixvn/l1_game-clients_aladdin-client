import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { AutoPlayStore } from "../../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/stores/auto-play-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { EarlyBetStore } from "../bet/early-bet-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;
const { Bet } = gc;

@ccclass
export class BetAmount extends ObserverComponent {
    @property(Node)
    nodeDisabledBetAmount: Node = null;

    showHideDisabledNode(isShow: boolean) {
        this.nodeDisabledBetAmount.active = isShow;
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateDisabledNode(autoPlay: boolean) {
        this.showHideDisabledNode(autoPlay);
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    withBetAccepted(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.showHideDisabledNode(true);
        } else {
            this.showHideDisabledNode(false);
        }
    }

    @render(EarlyBetStore, (store) => store.earlyBet)
    withEarlyBet(early: boolean) {
        this.showHideDisabledNode(early);
    }
}
