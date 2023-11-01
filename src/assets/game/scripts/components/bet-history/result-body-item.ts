import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";

const { ccclass } = _decorator;
const { property } = _decorator;

@ccclass
export default class ResultBodyItem extends BaseResultBodyItem {
    setData(result: gc.BetHistory.DynamicObject<ServiceCard>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {}
}
