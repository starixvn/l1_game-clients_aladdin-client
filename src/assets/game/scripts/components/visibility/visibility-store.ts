import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

@injectable()
export class VisibilityStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }
    isTabVisible = true;
}