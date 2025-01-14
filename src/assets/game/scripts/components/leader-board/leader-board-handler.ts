import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { IWinner, LeaderBoardStore } from "./leader-board-store";

const { injectable, inject } = inversify;

@injectable()
export class LeaderBoardHandler implements gc.Shared.IMultipleHandlers {
    @inject(LeaderBoardStore) protected readonly leaderBoardStore: LeaderBoardStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    handleWinner(winner: IWinner) {
        
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Winner.eventName,
            handle: this.handleWinner,
        },
    ];
}
