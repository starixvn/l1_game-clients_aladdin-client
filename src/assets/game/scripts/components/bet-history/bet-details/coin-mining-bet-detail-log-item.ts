import { _decorator } from "cc";
import BetDetailLogItem from "../../../../../../extensions/shared-components/assets/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";
const { ccclass } = _decorator;

@ccclass('coin_mining_bet_detail_log_item')
export class CoinMiningBetDetailLogItem extends BetDetailLogItem {
    setData(data) {
        super.setData(data);
 
        const { betDetailsLog, settlementResult } = data;
        const { choice } = betDetailsLog;
        if (choice === "draw") {
            if (!settlementResult["draw"]) {
                this.lblOdds.string = "-";
            }
        }
    }
}


