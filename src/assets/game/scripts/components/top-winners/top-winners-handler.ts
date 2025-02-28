import gc from "@sg/game-client-base";
import inversify from "inversify";
import { TopWinner, TopWinnersStore } from "./top-winners-store";

const { injectable, inject } = inversify;
const { NumberUtils } = gc.Shared.utils;

@injectable()
export class TopWinnersHandlers {
    @inject(TopWinnersStore) private readonly store: TopWinnersStore;

    addSingleTopWinner(winner: TopWinner) {
        this.store.newTopWinner = winner;
        this.store.winners.push(winner);
    }

    createTopWinners(winners: TopWinner[]) {
        this.store.winners = winners;
    }

    eventHandleList = [
        {
            name: "topWinner",
            handle: this.addSingleTopWinner,
        },
        {
            name: "topWinners",
            handle: this.createTopWinners,
        },
    ];
}
