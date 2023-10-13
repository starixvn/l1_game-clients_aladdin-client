import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;
const { CrashBet } = gc;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Sprite)
    sprSelectedBg: Sprite = null;
    private amount: number;

    @render(BetInputStore, (store) => store.betAmount)
    updateBetAmount(betAmount: number) {
        this.amount = betAmount;
    }

    @handle(CrashBet.CrashBetHandler, (handle, payload: { autoCashOut: number; amount: number }) => handle.handle(payload))
    onClickPlaceBet() {
        return { autoCashOut: 1.01, amount: this.amount };
    }
}
