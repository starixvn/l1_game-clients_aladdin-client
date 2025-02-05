import gc from "@sg/game-client-base";
import inversify from "inversify";
import { HashStore } from "./hash-store";
import { GameServiceMessage } from "../../game-message";

const { injectable, inject } = inversify;

@injectable()
export class HashHandlers {
    @inject(HashStore) private readonly hashStore: HashStore;

    updateHashValue(hashValue: string) {
        this.hashStore.hashValue = hashValue;
    }
}

@injectable()
export class HashValueHandler implements gc.Shared.IMultipleHandlers {
    @inject(HashHandlers) protected readonly hashHandlers: HashHandlers;
    handleHashValue(resultHash: GameServiceMessage.ResultHash) {
        this.hashHandlers.updateHashValue(resultHash.hashValue);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.ResultHash.eventName,
            handle: this.handleHashValue,
        },
    ];
}


