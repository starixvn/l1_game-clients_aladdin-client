import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetAmountHandlers } from "../bet-amount-handlers";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class BetLevelItem extends ObserverComponent {
    @property(Label)
    lblBet: Label = null;

    @handle(BetAmountHandlers, (handler, amount: number) => handler.updateBetAmount(amount))
    onClickBetItem() {
        return +this.lblBet.string;
    }

    setData(betLevel: number) {
        this.lblBet.string = betLevel.toString();
    }
}
