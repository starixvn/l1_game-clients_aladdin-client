import { _decorator, Button, EventHandler, instantiate, Label, Node, Prefab } from "cc";
import BetHistoryBodyItem, { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import { BetDetailStore, IBetLog } from "db://shared-components/game/bet-history/scripts/components/bet-detail/stores/bet-detail-store";
import Observer from "observer";
import ResultBodyItem from "./result-body-item";

const { ccclass } = _decorator;
const { property } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
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
    betLog: IBetLog = null;

    setData(betLog: IBetLog, index: number) {
        this.betLog = betLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, betwin, roundId, totalAmount } = betLog;

        this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
        this.lblRound.string = roundId.toString();

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2);

        const bodyRow = instantiate(this.resultPrefab);
        bodyRow.getComponent(ResultBodyItem).setData(betLog);
        this.result.addChild(bodyRow);
    }

    @handle(BetDetailStore, (store, betLog: IBetLog) => store.setData(betLog))
    openTicketDetail() {
        this.playSoundClick();
        return this.betLog;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }
}
