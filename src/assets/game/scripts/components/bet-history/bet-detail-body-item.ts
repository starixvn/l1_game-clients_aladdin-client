import { _decorator, Color, Label, Node } from "cc";
import gc from "@sg/game-client-base";
import BetDetailBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-body-item";
import { IBetLogDetails } from "db://shared-components/game/bet-history/scripts/components/bet-detail/stores/bet-detail-store";

const { ccclass } = _decorator;
const { property } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;

@ccclass
export default class DragonTigerFightBetDetailBodyItem extends BetDetailBodyItem {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblOdds: Label = null;

    @property(Label)
    lblAmount: Label = null;

    @property(Label)
    lblChoice: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    setData(data: IBetLogDetails, index: number, odds: any, settlementResult: any, freeBet: boolean) {
        this.nodeBackground.active = index % 2 > 0;
        const { time, amount, choice } = data;

        if (this.lblTime && this.lblTime.node.children.length === 0) {
            this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
            this.lblTime.color = amount ? Color.YELLOW : Color.WHITE;
        } else if (this.lblDate && this.lblHour) {
            this.lblDate.string = DateTimeUtils.getStringDate(time);
            this.lblHour.string = DateTimeUtils.getStringHourByTime(time);
        }

        this.lblChoice.string = choice;
        this.lblOdds.string = odds[choice]; // TO DO check fractionalOddsFormat

        this.lblAmount.string = FormatUtils.numberWithCommas(amount);

        const effectiveOdds = freeBet ? odds[choice] - 1 : odds[choice];
        const winningAmount = settlementResult[choice] ? amount * effectiveOdds : 0;
        this.lblWin.string = FormatUtils.numberWithCommas(winningAmount);
    }
}
