import inversify from "inversify";
import mobx from "mobx";
import { AutoPlayStore } from "../auto-play/auto-play-store";

const { injectable, inject } = inversify;

export interface IWinner {
    name: string;
    betWin: number;
}

@injectable()
export class LeaderBoardStore {
    @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore;
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _winner: IWinner = null;
    winners: IWinner[] = [];
    private readonly WINNERS_MAX_ON_BOARD = 8;

    get winner() {
        return this._winner;
    }

    set winner(winner: IWinner) {
        this._winner = winner;
    }

    get winnersShowOnBoard() {
        if (this.winners.length >= this.WINNERS_MAX_ON_BOARD) {
            return this.winners.slice(0, this.WINNERS_MAX_ON_BOARD);
        }
        return this.winners;
    }
}
