import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { BetStore } from "./bet-store";
const { injectable, inject } = inversify;

@injectable()
export class InstantMineHandler implements gc.Shared.IMultipleHandlers {
    @inject(BetStore) protected readonly betStore: BetStore;
    handleMine(multiplier: number) {
        this.betStore.multiplier = multiplier;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Bet.eventName,
            handle: this.handleMine,
        },
    ];
}
