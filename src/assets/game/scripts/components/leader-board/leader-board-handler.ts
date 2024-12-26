import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { LeaderBoardStore } from "./leader-board-store";

const { injectable, inject } = inversify;

@injectable()
export class LeaderBoardHandler implements gc.Shared.IMultipleHandlers {
    @inject(LeaderBoardStore) protected readonly leaderBoardStore: LeaderBoardStore;
    handleWinner(winner: GameServiceMessage.Winner) {
        //this.leaderBoardStore.winner = winner;
        this.leaderBoardStore.winners.unshift(winner);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Winner.eventName,
            handle: this.handleWinner,
        },
    ];
}
