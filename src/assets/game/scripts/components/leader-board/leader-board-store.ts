import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

export interface IWinner {
    name: string;
    betWin: number;
    bigWin: boolean;
}

@injectable()
export class LeaderBoardStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _winner: IWinner = null;

    get winner() {
        return this._winner;
    }

    set winner(winner: IWinner) {
        this._winner = winner;
    }
}
