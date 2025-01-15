import inversify from "inversify";
import mobx from "mobx";

const { injectable } = inversify;

export interface IPlayer {
    id: string;
    name: string;
    betWin: number;
    bigWin: boolean;
    rate: number;
    avatarId: number;
}

@injectable()
export class RoomStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _player: IPlayer = null;

    get player() {
        return this._player;
    }

    set player(player: IPlayer) {
        this._player = player;
    }
}
