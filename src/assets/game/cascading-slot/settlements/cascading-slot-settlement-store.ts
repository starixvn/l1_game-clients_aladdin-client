import inversify from "inversify";
import mobx from "mobx";
import { GameServiceMessage } from "../game-messages";
const { injectable, inject } = inversify;

@injectable()
export class CascadingSlotSettlementStore {
    private _dataFinish = (GameServiceMessage.CascadingSlotFinish = null);
    constructor() {
        mobx.makeAutoObservable(this);
    }

    get dataFinish() {
        return this._dataFinish;
    }

    set dataFinish(data: GameServiceMessage.CascadingSlotFinish) {
        this._dataFinish = data;
    }
}
