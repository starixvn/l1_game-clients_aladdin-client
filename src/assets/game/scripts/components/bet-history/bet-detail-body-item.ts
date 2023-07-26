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
        super.setData(betDetailsLog, index, odd, settlementResult, freeBet, fractionalOddsFormat);

        if (settlementResult[choice]) {
            const effectiveOdds = freeBet ? odd - 1 : odd;
            const winningAmount = amount * effectiveOdds;
            this.lblWin.string = FormatUtils.numberWithCommas(winningAmount);
            this.setHighlightTicketDetail(winningAmount > amount);
        } else {
            const lossAmount =
                settlementResult[BetChoice.Tie] && (choice == BetChoice.Tiger || choice == BetChoice.Dragon) ? amount / 2 : 0;
            this.lblWin.string = FormatUtils.numberWithCommas(lossAmount);
        }
    }
}
