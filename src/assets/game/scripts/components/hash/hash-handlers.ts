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

    handleHashValue(resultHash: GameServiceMessage.ResultHash) {
        this.updateHashValue(resultHash.hashValue);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.ResultHash.eventName,
            handle: this.handleHashValue
        },
    ];
}