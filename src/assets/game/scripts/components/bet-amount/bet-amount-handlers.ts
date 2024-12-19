import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetAmountStore } from "./bet-amount-store";

const { injectable, inject } = inversify;

@injectable()
export class BetAmountHandlers implements gc.Shared.IHandler<gc.GameServiceMessage.GameConfigs> {
    @inject(BetAmountStore) protected readonly betAmountStore: BetAmountStore;
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    handle(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        this.gameConfig.setGameConfigs(gameConfigs);
    }

    updateBetAmount(betAmount: number) {
        this.betAmountStore.betAmount = betAmount;
    }
}
