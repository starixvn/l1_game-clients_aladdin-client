import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;

@injectable()
export class AutoStartStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    public isAutoStart = false;
}