import inversify from "inversify";
import mobx from "mobx";
import { GameServiceMessage } from "../game-messages";
const { injectable, inject } = inversify;

@injectable()
export class CascadingSlotConfigsStore {
    private _gameConfigs: GameServiceMessage.CascadingSlotConfigs = null;
    constructor() {
        mobx.makeAutoObservable(this);
    }

    get gameConfigs() {
        return this._gameConfigs;
    }

    set gameConfigs(gameConfigs: GameServiceMessage.CascadingSlotConfigs) {
        this._gameConfigs = gameConfigs;
    }
}
