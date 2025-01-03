import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetAmountHandlers } from "../bet-amount-handlers";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class BetLevelItem extends ObserverComponent {
    @property(Label)
    lblBet: Label = null;

    @property(Node)
    nodeSelectedBg: Node = null;

    @handle(BetAmountHandlers, (handler, amount: number) => handler.updateBetAmount(amount))
    onClickBetItem() {
        return +this.lblBet?.string?.replace(/,/g, "");
    }

    setData(betLevel: number) {
        this.lblBet.string = FormatUtils.numberWithCommas(betLevel, 2);
    }

    setSelectedNode(isSelected: boolean) {
        this.nodeSelectedBg.active = isSelected;
    }
}
