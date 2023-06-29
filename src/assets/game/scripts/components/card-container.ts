import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { PokerCard, ServiceCard } from "db://shared-components/game/poker-cards/scripts/poker-card";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetChoice, Choice } from "./dtf-commons";

const { Connection, Settlements, Rounds } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class CardContainer extends ObserverComponent {
    @property(PokerCard)
    cards: PokerCard[] = [];

    @render(Settlements.SettlementStore, (store) => store.result, { fireImmediately: false })
    renderResultCards(result: gc.GameServiceMessage.TResult) {
        this.cards[Choice.Dragon].setServiceCard(result[BetChoice.Dragon] as ServiceCard);
        this.cards[Choice.Tiger].setServiceCard(result[BetChoice.Tiger] as ServiceCard);
        this.openCards();
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    handleStartingRound(roundState: string) {
        this.closeCards();
    }

    openCards() {
        this.cards.forEach((card) => card.faceUp());
    }

    closeCards() {
        this.cards.forEach((card) => card.faceDown());
    }
}
