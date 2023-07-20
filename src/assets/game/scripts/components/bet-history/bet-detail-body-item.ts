import { _decorator, Color, Label, Node } from "cc";
import gc from "@sg/game-client-base";
import BetDetailBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-body-item";

const { ccclass } = _decorator;
const { property } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;

const choiceMapping = {
    dragon: "Dragon",
    tiger: "Tiger",
    tie: "Tie",
    blackDragon: "Black Dragon",
    redDragon: "Red Dragon",
    blackTiger: "Black Tiger",
    redTiger: "Red Tiger",
};

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

    setData(
        data: gc.BetHistory.BetDetailsLog,
        index: number,
        odd: number,
        isWin: boolean,
        freeBet: boolean,
        fractionalOddsFormat: boolean,
        isTie?: boolean
    ) {
        this.nodeBackground.active = index % 2 > 0;

        const { time, amount, choice } = data;

        this.lblTime.string = DateTimeUtils.formatDateTime(time);
        this.lblChoice.string = choiceMapping[choice];
        this.lblOdds.string = (fractionalOddsFormat ? FormatUtils.numberWithCommas(+odd - 1, 2) : odd).toString();
        this.lblAmount.string = FormatUtils.numberWithCommas(amount);

        if (isTie) {
            this.lblWin.string = FormatUtils.numberWithCommas(amount / 2);
        } else {
            const effectiveOdds = freeBet ? odd - 1 : odd;
            const winningAmount = isWin ? amount * effectiveOdds : 0;
            this.lblWin.string = FormatUtils.numberWithCommas(winningAmount);
            this.setHighlightTicketDetail(winningAmount > amount);
        }
    }

    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblChoice.color = color;
        this.lblOdds.color = color;
        this.lblAmount.color = color;
        this.lblWin.color = color;
    }
}
