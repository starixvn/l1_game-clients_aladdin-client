import gc from "@sg/game-client-base";
import { Label, Node, Vec3, _decorator, sp } from "cc";
import { PokerCard, ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
//import "./../../../resources/i18n";
import { BetChoice, Choice } from "./dtf-commons";
const { Settlements, Rounds } = gc;

const { movingNode, getPositionAtDestNode, playSpine, fadeOut, fadeIn } = AnimationUtils;

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer, render } = Observer;

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

    @property({ type: sp.Skeleton })
    resultSpines: sp.Skeleton[] = [];

    @property({ type: Node })
    staticMonsters: Node[] = [];

    override namespace = settings.name;
    override containerOptions = containerOptions;

    private originalCardPosition: Vec3[] = [];

    onLoad() {
        super.onLoad();
        this.initResultSpines();
        this.cards.forEach((card) => this.originalCardPosition.push(new Vec3(card.node.position)));
    }

    async finishShowResult(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        await this.showResultSpines(settlementResult);
        super.finishShowResult(settlementResult);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.renderResultCards(result);

            if (hasAnimation) {
                await this.openCards();
            }
        }
    }

    private initResultSpines() {
        this.resultSpines.forEach((spine) => {
            spine.node.active = false;
            // spine.setCompleteListener(() => (spine.node.active = false));
        });
    }

    private async showResultSpines(settlementResult: gc.GameServiceMessage.TSettlementResult) {
        const winChoice = Object.keys(settlementResult).find((choice) => settlementResult[choice]);
        if (winChoice === BetChoice.Tie) {
            return;
        }
        const spine = this.resultSpines.find((spine) => spine.node.name === winChoice);
        const staticImage = this.staticMonsters.find((staticMonster) => staticMonster.name === winChoice);
        if (spine) {
            await fadeOut(staticImage, 0.2);
            spine.node.active = true;
            await playSpine(spine, winChoice);
            await fadeIn(staticImage, 0.2);
            spine.node.active = false;
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
