import { _decorator } from "cc";
import gc from "@sg/game-client-base";
import BetDetailBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-body-item";
import { BetChoice } from "../dtf-commons";

const { ccclass } = _decorator;
const { FormatUtils } = gc;

@ccclass
export default class DragonTigerFightBetDetailBodyItem extends BetDetailBodyItem {
    choiceMapping = {
        dragon: "Dragon",
        tiger: "Tiger",
        tie: "Tie",
        blackDragon: "Black Dragon",
        redDragon: "Red Dragon",
        blackTiger: "Black Tiger",
        redTiger: "Red Tiger",
    };

    setData(
        betDetailsLog: gc.BetHistory.BetDetailsLog,
        index: number,
        odd: number,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ) {
        const { amount, choice } = betDetailsLog;
        if (settlementResult[BetChoice.Tie]) {
            this.lblWin.string = FormatUtils.numberWithCommas(amount / 2);
        } else {
            const effectiveOdds = freeBet ? odd - 1 : odd;
            const winningAmount = settlementResult[choice] ? amount * effectiveOdds : 0;
            this.lblWin.string = FormatUtils.numberWithCommas(winningAmount);
            this.setHighlightTicketDetail(winningAmount > amount);
        }
    }
}
