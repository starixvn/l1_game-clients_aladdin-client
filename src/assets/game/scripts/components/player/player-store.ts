import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export class Player {
    id: string;
    name: string;
    red: number;
    avatarId: number;
    type: boolean;
    rate?: number;
    multiplier?: number;
}

@injectable()
export class PlayerStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    players: Player[] = [];
}




