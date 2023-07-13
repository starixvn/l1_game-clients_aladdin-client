import { _decorator, Button, Color, EventHandler, Label, Node } from "cc";
import BetHistoryBodyItem from "../../../../../extensions/shared-components/assets/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import {
    convertRank,
    PokerCard,
    ServiceCard,
} from "../../../../../extensions/shared-components/assets/game/poker-cards/scripts/poker-card";
import { BetChoice, Choice } from "../dtf-commons";
import {
    BetDetailStore,
    IBetDetailLog,
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
    setData(data: any, index: number) {
        console.log(data);
        this.nodeBackground.active = index % 2 > 0;
        const { time, result, betwin, win, roundId, betLogDetails } = data;

        if (this.lblTime && this.lblTime.node.children.length === 0) {
            this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
            this.lblTime.color = win ? Color.YELLOW : Color.WHITE;
        } else if (this.lblDate && this.lblHour) {
            this.lblDate.string = DateTimeUtils.getStringDate(time);
            this.lblHour.string = DateTimeUtils.getStringHourByTime(time);
        }
        this.lblRound.string = roundId;

        const dragonCard = result[BetChoice.Dragon] as ServiceCard;
        this.cards[Choice.Dragon].setServiceCard(dragonCard);
        this.cards[Choice.Dragon].faceUp();
        this.dragonRank.string = convertRank(dragonCard.rank);

        const tigerCard = result[BetChoice.Tiger] as ServiceCard;
        this.cards[Choice.Tiger].setServiceCard(tigerCard);
        this.cards[Choice.Tiger].faceUp();
        this.tigerRank.string = convertRank(tigerCard.rank);

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(betwin, 2);

        this.clickEventHandler.target = this.btnRound.node;
        this.clickEventHandler.customEventData = betLogDetails;
    }

    @handle(BetDetailStore, (store, betLogDetails: Array<IBetDetailLog>) => {
        const data = [
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:23.380Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:23.338Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:23.229Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:23.175Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:23.079Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:23.025Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:22.033Z",
                choice: "blackDragon",
                receivedTime: "2023-07-13T08:31:21.972Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:22.781Z",
                choice: "tie",
                receivedTime: "2023-07-13T08:31:22.737Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:22.475Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:22.450Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:22.330Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:22.284Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:22.928Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:22.882Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:22.626Z",
                choice: "tie",
                receivedTime: "2023-07-13T08:31:22.582Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:21.519Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:21.493Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:21.168Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:21.151Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:21.824Z",
                choice: "blackDragon",
                receivedTime: "2023-07-13T08:31:21.776Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:21.369Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:21.337Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:20.869Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:20.853Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:20.527Z",
                choice: "blackTiger",
                receivedTime: "2023-07-13T08:31:20.402Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:20.669Z",
                choice: "blackTiger",
                receivedTime: "2023-07-13T08:31:20.619Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:19.308Z",
                choice: "dragon",
                receivedTime: "2023-07-13T08:31:19.291Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:19.759Z",
                choice: "tie",
                receivedTime: "2023-07-13T08:31:19.732Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:19.561Z",
                choice: "tie",
                receivedTime: "2023-07-13T08:31:19.542Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:19.159Z",
                choice: "dragon",
                receivedTime: "2023-07-13T08:31:19.147Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:19.019Z",
                choice: "dragon",
                receivedTime: "2023-07-13T08:31:18.982Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:18.656Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:18.636Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:18.058Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:18.035Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:18.205Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:18.184Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:18.505Z",
                choice: "redDragon",
                receivedTime: "2023-07-13T08:31:18.480Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:17.756Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:17.697Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:17.904Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:17.862Z",
                rate: 1,
            },
            {
                amount: 10,
                rebet: false,
                roundId: 35296,
                time: "2023-07-13T08:31:17.506Z",
                choice: "redTiger",
                receivedTime: "2023-07-13T08:31:17.447Z",
                rate: 1,
            },
        ];

        console.log("openTicketDetail");
        store.setData(data);
    })
    openTicketDetail(betLogDetails: Array<IBetDetailLog>) {
        console.log(betLogDetails);
        // AudioManager.getInstance().playClick();
        return betLogDetails;
    }
}
