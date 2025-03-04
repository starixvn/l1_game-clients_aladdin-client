import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export interface TopWinner {
    name: string;
    winningAmount: number;
    rate: number;
}

@injectable()
export class TopWinnersStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    winners: TopWinner[] = [];

    newTopWinner: TopWinner = null;
}
