import { _decorator, Button, EventHandler, instantiate, Label, Node, Prefab } from "cc";
import BetHistoryBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import Observer from "observer";
import ResultBodyItem from "./result-body-item";
import { ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";

const { ccclass } = _decorator;
const { property } = _decorator;
const { DateTimeUtils, FormatUtils, BetHistory } = gc;
const { handle } = Observer;

@ccclass
export default class DragonTigerFightBetHistoryBodyItem extends BetHistoryBodyItem {
    @property(Label)
    lblTime: Label = null;

    @property(Label)
    lblRound: Label = null;

    @property(Label)
    lblTotalStake: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    @property(Button)
    btnRound: Button = null;

    @property(Prefab)
    resultPrefab: Prefab = null;

    @property(Node)
    result: Node = null;

    clickEventHandler = new EventHandler();
    betHistoryLog: gc.BetHistory.BetHistoryLog = null;
    fractionalOddsFormat: boolean = false;

    setData(betHistoryLog: gc.BetHistory.BetHistoryLog, index: number) {
        this.betHistoryLog = betHistoryLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, betwin, roundId, totalAmount } = betHistoryLog;

        this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
        this.lblRound.string = roundId.toString();

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2);

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
