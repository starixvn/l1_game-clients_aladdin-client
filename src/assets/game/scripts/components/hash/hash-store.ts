import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export interface ProvablyFair {
    serverSeed: string;
    serverSeedHash: string;
    finalHash: string;
    clientSeed: string;
    finalResult: number;
    roundId: number;
}

@injectable()
export class HashStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    hashValue = "";
    verification: ProvablyFair = null;
}


