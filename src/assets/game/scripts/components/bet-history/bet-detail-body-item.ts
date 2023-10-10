import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import BaseBetDetailBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-body-item";
import { ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";
import { BetChoice } from "../dtf-commons";

const { ccclass } = _decorator;
const { FormatUtils } = gc;

@ccclass
export default class BetDetailBodyItem extends BaseBetDetailBodyItem {
    setData(
        betDetailsLog: gc.BetHistory.BetDetailsLog,
        index: number,
        odds: gc.BetHistory.DynamicObject<number>,
        settlementResult: gc.BetHistory.DynamicObject<boolean>,
        result: gc.BetHistory.DynamicObject<ServiceCard>,
        freeBet: boolean,
        fractionalOddsFormat: boolean
    ) {
        const { amount, choice } = betDetailsLog;
        const odd = odds[choice];

        super.setData(betDetailsLog, index, odds, settlementResult, result, freeBet, fractionalOddsFormat);

        this.lblOdds.string = (fractionalOddsFormat ? FormatUtils.numberWithCommas(+odd - 1, 2) : odd).toString();
        if (settlementResult[choice]) {
            const effectiveOdds = freeBet ? odd - 1 : odd;
            const winningAmount = amount * effectiveOdds;
            this.lblWin.string = FormatUtils.numberWithCommas(winningAmount, 2);
            this.setHighlightTicketDetail(winningAmount > amount);
        } else {
            const lossAmount =
                settlementResult[BetChoice.Tie] && (choice === BetChoice.Tiger || choice === BetChoice.Dragon) ? amount / 2 : 0;
            this.lblWin.string = FormatUtils.numberWithCommas(lossAmount, 2);
        }
    }
}
