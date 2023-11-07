import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import BaseBetDetailBodyItem, {
    BetDetailLogItemType,
} from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";

const { ccclass } = _decorator;
const { FormatUtils } = gc;

type SpaceFlightBetDetailLogItemType = BetDetailLogItemType & {
    result: gc.BetHistory.DynamicObject<null>;
};

@ccclass
export default class BetDetailBodyItem extends BaseBetDetailBodyItem {
    setData(data: SpaceFlightBetDetailLogItemType) {
        const { betDetailsLog, odds, settlementResult, result, freeBet, fractionalOddsFormat } = data;
        const { amount, choice } = betDetailsLog;
        const odd = odds[choice];

        super.setData(data);

        // this.lblOdds.string = (fractionalOddsFormat ? FormatUtils.numberWithCommas(+odd - 1, 2) : odd).toString();
        // if (settlementResult[choice]) {
        //     const effectiveOdds = freeBet ? odd - 1 : odd;
        //     const winningAmount = amount * effectiveOdds;
        //     this.lblWin.string = FormatUtils.numberWithCommas(winningAmount, 2);
        //     this.setHighlightTicketDetail(winningAmount > amount);
        // } else {
        //     const lossAmount =
        //         settlementResult[BetChoice.Tie] && (choice === BetChoice.Tiger || choice === BetChoice.Dragon) ? amount / 2 : 0;
        //     this.lblWin.string = FormatUtils.numberWithCommas(lossAmount, 2);
        // }
    }
}
