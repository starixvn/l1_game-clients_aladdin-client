import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetStore } from "./bet-store";

const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
    @inject(BetStore) protected readonly betsStore: BetStore;
    handle() {
        const betData = this.createCommonBetData();
        this.handleBetData(betData);
    }

    updateMultiplier(multiplier: number) {
        this.betsStore.multiplier = multiplier;
    }

    updateStatusHittingCoin(status: boolean) {
        this.betsStore.isHittingOnCoin = status;
    }
}
