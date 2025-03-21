import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class CascadingSlotBoardStore {
    private _result = "";
    constructor() {
        mobx.makeAutoObservable(this);
    }

    get result() {
        return this._result;
    }

    set result(_result: string) {
        this._result = this.result;
    }
}
