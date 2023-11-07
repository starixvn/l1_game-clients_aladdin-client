import gc from "@sg/game-client-base";
import { _decorator } from "cc";

import { BetDetailLogItemType } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";
import CrashGameBetDetailLogItem from "db://shared-components/game-crash/bet-history-details/scripts/bet-detail-log-item";

const { ccclass } = _decorator;
const { FormatUtils } = gc;

type SpaceFlightBetDetailLogItemType = BetDetailLogItemType & {
    result: gc.BetHistory.DynamicObject<null>;
};

@ccclass
export default class BetDetailBodyItem extends CrashGameBetDetailLogItem {
    setData(data: SpaceFlightBetDetailLogItemType) {
        const { betDetailsLog, odds, settlementResult, result, freeBet, fractionalOddsFormat } = data;
        const { amount, choice } = betDetailsLog;
        const odd = odds[choice];

        super.setData(data);
    }
}
