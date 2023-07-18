import { _decorator, Color, Label } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { convertRank, PokerCard, ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";
import { BetChoice, Choice } from "../dtf-commons";
import gc from "@sg/game-client-base";

const { ccclass } = _decorator;
const { property } = _decorator;

@ccclass
export default class ResultBodyItem extends BaseResultBodyItem {
    @property(PokerCard)
    cards: PokerCard[] = [];

    @property(Label)
    dragonRank: Label = null;

    @property(Label)
    tigerRank: Label = null;

    setData(result: gc.BetHistory.DynamicObject<ServiceCard>, settlementResult: gc.BetHistory.DynamicObject<boolean>) {
        const dragonCard = result[BetChoice.Dragon];
        this.cards[Choice.Dragon].setServiceCard(dragonCard);
        this.cards[Choice.Dragon].faceUp();
        this.dragonRank.string = convertRank(dragonCard.rank);
        this.dragonRank.color = settlementResult[BetChoice.Dragon] ? Color.YELLOW : Color.WHITE;

        const tigerCard = result[BetChoice.Tiger];
        this.cards[Choice.Tiger].setServiceCard(tigerCard);
        this.cards[Choice.Tiger].faceUp();
        this.tigerRank.string = convertRank(tigerCard.rank);
        this.tigerRank.color = settlementResult[BetChoice.Tiger] ? Color.YELLOW : Color.WHITE;
    }
}
