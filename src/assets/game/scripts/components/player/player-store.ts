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
    status?: PlayerWinMessage;
    
    constructor(config: {
        id: string;
        name: string;
        red: number;
        avatarId: number;
        type: boolean;
        rate?: number;
        multiplier?: number;
    }) {
        Object.assign(this, config);
    }
}

export class PlayerWinMessage {
    bet: number;
    playerId: string;
    rate: number;
    reachMaxWin: boolean;
    win: boolean;

    static eventName = "winners";
}

export class PlayerChipMessage {
    amount: number;
    maxBet: number;
    minBet: number;
    name: string;
    playerId: string;
    red: number;
    scoins: number;

    static eventName = "playerChip";
}

@injectable()
export class PlayerStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    players: Player[] = [];
    updatePlayerInfoIndex: number = -1;
}




