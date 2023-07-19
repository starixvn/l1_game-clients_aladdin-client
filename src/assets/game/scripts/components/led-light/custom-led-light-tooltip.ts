import gc from "@sg/game-client-base";
import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";
import { ServiceCard, convertRank } from "db://shared-components/game/poker-cards/scripts/poker-card";
import { BetChoice } from "../dtf-commons";
const { ccclass, property } = _decorator;

type TCard = {
    rank: number;
    suit: number;
};
@ccclass("CustomLedLightTooltip")
export class CustomLedLightTooltip extends LedLightTooltip {
    @property(Label)
    lblDragonValue: Label = null;

    @property(Sprite)
    spriteCardDragon: Sprite = null;

    @property(Label)
    lblTigerValue: Label = null;

    @property(Sprite)
    spriteCardTiger: Sprite = null;

    @property({ type: SpriteFrame })
    cardTypeSprite: SpriteFrame[] = [];

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        this.roundId.string = `#${ledLightInfo.roundId}`;

        const winChoice = this.findWinningChoice(ledLightInfo);
        const name = gc.Translator.gameTranslate(`glossary_${winChoice}`);
        this.result.string = name;

        this.showCardInfo(ledLightInfo?.result?.dragon, this.lblDragonValue, this.spriteCardDragon);
        this.showCardInfo(ledLightInfo?.result?.tiger, this.lblTigerValue, this.spriteCardTiger);

        this.showTooltip();
    }

    protected findWinningChoice(ledLightInfo: gc.RoundHistories.RoundHistory): string {
        const choices = [BetChoice.Dragon, BetChoice.Tiger, BetChoice.Tie];
        let winChoice = "";

        choices.forEach((choice) => {
            if (ledLightInfo.settlementResult[choice]) {
                winChoice = choice;
            }
        });

        return winChoice;
    }

    protected showCardInfo(card: ServiceCard, label: Label, sprite: Sprite) {
        if (card) {
            const cardRank = convertRank(card.rank);
            label.string = cardRank;
            sprite.spriteFrame = this.cardTypeSprite[card.suit];
        } else {
            label.string = "";
            sprite.spriteFrame = null;
        }
    }
}
