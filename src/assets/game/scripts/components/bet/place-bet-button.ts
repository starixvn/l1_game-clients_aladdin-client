import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet, Bet } = gc;

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
            this.node.active = false;
        }
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    onClickPlaceBet() {
        return { autoCashOut: undefined, amount: this.amount };
    }

    setStatusBet(selected: boolean) {
        this.bgWaiting.node.active = selected;
        this.sprBetAccepted.node.active = selected;
        this.sprPlaceBet.node.active = !selected;
        this.bgPlaceBet.node.active = !selected;       
    }
}
