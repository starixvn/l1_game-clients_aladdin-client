import gc from "@sg/game-client-base";
import { Label, Node, Vec3, _decorator } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";
import { PokerCard, ServiceCard } from "../../../../extensions/shared-components/assets/game/poker-cards/scripts/poker-card";
import { AnimationUtils } from "../../../../extensions/shared-components/assets/shared/utils";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { BetChoice, Choice } from "./dtf-commons";
const { Settlements, Rounds } = gc;

const { movingNode, getPositionAtDestNode } = AnimationUtils;

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(PokerCard)
    cards: PokerCard[] = [];

    @property(Node)
    nodeCardBox: Node = null;

    @property(Node)
    nodeCardDrop: Node = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;

    private originalCardPosition: Vec3[] = [];

    onLoad() {
        super.onLoad();
        this.cards.forEach((card) => this.originalCardPosition.push(new Vec3(card.node.position)));
    }

    showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.renderResultCards(result);

            if (hasAnimation) {
                this.openCards().then(() => {
                    this.finishShowResult();
                });
            }
        }
    }

    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);

            await this.dropCards();
            await this.drawCards();
        }
    }

    async drawCards() {
        const cards = this.cards;
        const pullDuration = 0.1;
        const drawDuration = 0.4;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const destPosition = getPositionAtDestNode(card.node, this.nodeCardBox);
            card.node.position = destPosition;
            await card.pullCard(pullDuration);
            movingNode(card.node, drawDuration, this.originalCardPosition[i]);
            await card.drawCard(drawDuration);
        }
    }

    async dropCards() {
        const cards = this.cards;
        const dropDruration = 0.5;
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            movingNode(card.node, dropDruration, this.nodeCardDrop);
            const isLast = i === cards.length - 1;
            if (isLast) {
                await card.dropCard(dropDruration);
            } else {
                card.dropCard(dropDruration);
            }
        }
    }

    private renderResultCards(result: gc.GameServiceMessage.TResult) {
        this.cards[Choice.Dragon].setServiceCard(result[BetChoice.Dragon] as ServiceCard);
        this.cards[Choice.Tiger].setServiceCard(result[BetChoice.Tiger] as ServiceCard);
    }

    private async openCards() {
        await this.cards[Choice.Dragon].openCard();
        await this.cards[Choice.Tiger].openCard();
    }

    private closeCards() {
        this.cards.forEach((card) => card.faceDown());
    }
}
