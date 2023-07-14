import { _decorator, Button, Color, EventHandler, Label, Node } from "cc";
import BetHistoryBodyItem from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import { convertRank, PokerCard } from "db://shared-components/game/poker-cards/scripts/poker-card";
import { BetChoice, Choice } from "../dtf-commons";
import {
    BetDetailStore,
    IBetLog,
} from "../../../../../extensions/shared-components/assets/game/bet-history/scripts/components/bet-detail/stores/bet-detail-store";
import Observer from "observer";

const { ccclass } = _decorator;
const { property } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
const { render, handle, observer } = Observer;
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

    @property(PokerCard)
    cards: PokerCard[] = [];

    @property(Label)
    dragonRank: Label = null;

    @property(Label)
    tigerRank: Label = null;

    @property(Button)
    btnRound: Button = null;

    clickEventHandler = new EventHandler();
    betLog: IBetLog = null;

    setData(betLog: IBetLog, index: number) {
        this.betLog = betLog;
        this.nodeBackground.active = index % 2 > 0;
        const { time, result, betwin, win, roundId, totalAmount } = betLog;

        if (this.lblTime && this.lblTime.node.children.length === 0) {
            this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
            this.lblTime.color = win ? Color.YELLOW : Color.WHITE;
        } else if (this.lblDate && this.lblHour) {
            this.lblDate.string = DateTimeUtils.getStringDate(time);
            this.lblHour.string = DateTimeUtils.getStringHourByTime(time);
        }
        this.lblRound.string = roundId.toString();

        const dragonCard = result[BetChoice.Dragon];
        this.cards[Choice.Dragon].setServiceCard(dragonCard);
        this.cards[Choice.Dragon].faceUp();
        this.dragonRank.string = convertRank(dragonCard.rank);

        const tigerCard = result[BetChoice.Tiger];
        this.cards[Choice.Tiger].setServiceCard(tigerCard);
        this.cards[Choice.Tiger].faceUp();
        this.tigerRank.string = convertRank(tigerCard.rank);

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(totalAmount, 2);
    }

    @handle(BetDetailStore, (store, betLog: IBetLog) => {
        console.log("openTicketDetail");
        store.setData(betLog);
    })
    openTicketDetail() {
        // AudioManager.getInstance().playClick();
        return this.betLog;
    }
}
