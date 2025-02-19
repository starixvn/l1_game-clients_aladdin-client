import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { HashStore } from "./hash-store";

const { injectable, inject } = inversify;

export enum VerificationMode {
    History = 0,
    LatestRounds = 1,
}

export class RoundPF {
    static eventName = "getProvablyFair";
}

@injectable()
export class HashHandlers {
    @inject(HashStore) private readonly hashStore: HashStore;
    @inject(gc.RoundBasePF.ProvablyFairHandler) protected readonly provablyFairHandler: gc.RoundBasePF.ProvablyFairHandler;
    @inject(gc.RoundBasePF.ProvablyFairStore) protected readonly provablyFairStore: gc.RoundBasePF.ProvablyFairStore;
    @inject(gc.RoundPF.RoundPFHandler) protected readonly roundPFHandler: gc.RoundPF.RoundPFHandler;
    @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore;

    updateHashValue(hashValue: string) {
        this.hashStore.hashValue = hashValue;
    }

    openVerificationHistory(roundId: number) {
        this.roundPFHandler.requestForCurrentRound = false;
        this.connectionStore.send(RoundPF.eventName, { roundId });
        this.provablyFairStore.openVerification = { mode: VerificationMode.History, roundId };
    }

    handleHashValue(resultHash: GameServiceMessage.ResultHash) {
        this.updateHashValue(resultHash.hashValue);
    }

    handleProvablyFair(provablyFair: GameServiceMessage.ProvablyFair) {
        this.hashStore.verification = provablyFair;
    }

    handleGenerateRandomClientSeed() {
        this.provablyFairStore.generateRandomClientSeed();
        this.provablyFairHandler.clearLastBetClientSeed();
    }

    eventHandleList = [
        {
            name: GameServiceMessage.ResultHash.eventName,
            handle: this.handleHashValue,
        },
        {
            name: GameServiceMessage.ProvablyFair.eventName,
            handle: this.handleProvablyFair,
        },
    ];
}
