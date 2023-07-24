import { _decorator, instantiate, Node, Prefab } from "cc";
import BetHistoryBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import Observer from "observer";
import ResultBodyItem from "./result-body-item";
import { ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";

const { ccclass, property } = _decorator;
const { BetHistory } = gc;
const { handle } = Observer;

@ccclass
export default class DragonTigerFightBetHistoryBodyItem extends BetHistoryBodyItem {
    @property(Prefab)
    resultPrefab: Prefab = null;

    @property(Node)
    result: Node = null;

    setData(betHistoryLog: gc.BetHistory.BetHistoryLog, index: number) {
        super.setData(betHistoryLog, index);
        const bodyRow = instantiate(this.resultPrefab);
        const { result, settlementResult } = betHistoryLog;
        bodyRow.getComponent(ResultBodyItem).setData(result as gc.BetHistory.DynamicObject<ServiceCard>, settlementResult);
        this.result.addChild(bodyRow);
    }

    @handle(BetHistory.BetDetailHitoryStore, (store, betHistoryLog: gc.BetHistory.BetHistoryLog) => {
        store.setData(betHistoryLog);
    })
    openTicketDetail() {
        this.playSoundClick();
        return this.betHistoryLog;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
