import { _decorator, Color, Label, Node, Sprite, SpriteFrame } from "cc";
import BetHistoryBodyItem from "../../../../../extensions/shared-components/assets/game/bet-history/scripts/components/bet-history-body-item";
import gc from "@sg/game-client-base";

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
    lblWin: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    @property(Sprite)
    sprResult: Sprite = null;

    @property(Label)
    lblResult: Label = null;

    @property(Label)
    lblDate: Label = null;

    @property(Label)
    lblHour: Label = null;

    @property(Label)
    odd: Label = null;

    @property(Label)
    even: Label = null;

    @property(Label)
    red2: Label = null;

    @property(Label)
    red3: Label = null;

    @property(Label)
    red4: Label = null;

    @property(Label)
    white3: Label = null;

    @property(Label)
    white4: Label = null;

    @property(SpriteFrame)
    sprIconRed: SpriteFrame = null;

    @property(SpriteFrame)
    sprIconWhite: SpriteFrame = null;

    setData(data: any, index: number) {
        this.nodeBackground.active = index % 2 > 0;
        const { time, phien, result, betwin, win, freeBet, settlementResult } = data;

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

        this.lblResult.string = number.toString();
        if (number % 2) {
            this.sprResult.spriteFrame = this.sprIconRed;
            this.lblResult.color = Color.WHITE;
        } else {
            this.sprResult.spriteFrame = this.sprIconWhite;
            this.lblResult.color = Color.BLACK;
        }

        this.lblWin.string = FormatUtils.numberWithCommas(betwin, 2);

        Object.keys(settlementResult).forEach((choice) => {
            const historyItem = this[choice];
            historyItem.string = freeBet ? 0 : FormatUtils.numberWithCommas(data[choice]);

            if (settlementResult[choice]) {
                historyItem.node.color = Color.YELLOW;
            } else {
                historyItem.node.color = Color.WHITE;
            }
        });
    }
}
