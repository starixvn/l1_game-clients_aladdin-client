import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet, Bet, Rounds } = gc;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Sprite)
    bgWaiting: Sprite = null;

    @property(Sprite)
    bgPlaceBet: Sprite = null;

    @property(Sprite)
    sprPlaceBet: Sprite = null;

    @property(Sprite)
    sprBetAccepted: Sprite = null;

    private amount: number;

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    changeText(lastReceivedBet: any) {
        if (lastReceivedBet && lastReceivedBet.value > 0) {
            this.setStatusBet(true);
        }
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    onClickPlaceBet() {
        return { autoCashOut: undefined, amount: this.amount };
    }

    @render(Rounds.RoundTimeStore, (store) => ({ roundState: store.roundState }))
    showPlaceBet({ roundState }) {
        if (roundState === Rounds.ROUND_STATE.LOCKING_BET) {
            this.setStatusBet(false);
        }
    }

    setStatusBet(selected: boolean) {
        this.bgWaiting.node.active = selected;
        this.sprBetAccepted.node.active = selected;
        this.sprPlaceBet.node.active = !selected;
        this.bgPlaceBet.node.active = !selected;
    }
    @render(Rounds.RoundTimeStore, (store) => store.remaining)
    updateCashoutButtonStatus(remaining: number) {
        this.node.active = remaining > 0 ? true : false;
    }
}
