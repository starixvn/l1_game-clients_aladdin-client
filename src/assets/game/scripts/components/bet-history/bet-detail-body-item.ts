import { _decorator, Color, Label, Node } from "cc";
import gc from "@sg/game-client-base";
import BetDetailBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-body-item";
import { IBetLogDetails } from "db://shared-components/game/bet-history/scripts/components/bet-detail/stores/bet-detail-store";

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

    setData(data: IBetLogDetails, index: number, odds: any, settlementResult: any, freeBet: boolean, fractionalOddsFormat: boolean) {
        this.nodeBackground.active = index % 2 > 0;

        const { time, amount, choice } = data;

        this.lblTime.string = DateTimeUtils.formatDateTime(time);
        this.lblChoice.string = choiceMapping[choice];
        this.lblOdds.string = fractionalOddsFormat ? FormatUtils.numberWithCommas(+odds - 1, 2) : odds[choice];
        this.lblAmount.string = FormatUtils.numberWithCommas(amount);

        const effectiveOdds = freeBet ? odds[choice] - 1 : odds[choice];
        const winningAmount = settlementResult[choice] ? amount * effectiveOdds : 0;
        this.lblWin.string = FormatUtils.numberWithCommas(winningAmount);
        this.setHighlightTicketDetail(winningAmount > amount);
    }

    setHighlightTicketDetail(highlight: boolean) {
        const color = highlight ? Color.YELLOW : Color.WHITE;
        this.lblChoice.color = color;
        this.lblOdds.color = color;
        this.lblAmount.color = color;
        this.lblWin.color = color;
    }
}
