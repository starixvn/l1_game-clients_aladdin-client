import { _decorator, Color, Label, Node, Sprite } from "cc";
import BetHistoryBodyItem from "../../../../../extensions/shared-components/assets/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";
import { PokerCard } from "../../../../../extensions/shared-components/assets/game/poker-cards/scripts/poker-card";

const { ccclass } = _decorator;
const { property } = _decorator;
const { DateTimeUtils, FormatUtils } = gc;
@ccclass
export default class SedieBetHistoryBodyItem extends BetHistoryBodyItem {
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

    @property(Sprite)
    sprResult: Sprite = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;
    
    @property(PokerCard)
    dragon: PokerCard = null;

    @property(PokerCard)
    tiger: PokerCard = null;


    setData(data: any, index: number) {
        this.nodeBackground.active = index % 2 > 0;
        const { time, phien, result, betwin, win } = data;

        if (this.lblTime && this.lblTime.node.children.length === 0) {
            this.lblTime.string = DateTimeUtils.getStringDateByTime(time);
            this.lblTime.color = win ? Color.YELLOW : Color.WHITE;
        } else if (this.lblDate && this.lblHour) {
            this.lblDate.string = DateTimeUtils.getStringDate(time);
            this.lblHour.string = DateTimeUtils.getStringHourByTime(time);
        }
        this.lblRound.string = phien;

        let number = 0;
        Object.keys(result).forEach((key) => {
            if (result[key]) {
                number++;
            }
        });


        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);
        this.lblTotalStake.string = FormatUtils.numberWithCommas(betwin, 2);
    }
}
