import gc from "@sg/game-client-base";
import inversify from "inversify";
import { HoldActionStore } from "./hold-action-store";
import { BetStore } from "./bet-store";

const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
    @inject(HoldActionStore) protected readonly holdActionStore: HoldActionStore;
    @inject(BetStore) protected readonly betsStore: BetStore;
    handle() {
        const betData = this.createCommonBetData();
        this.handleBetData(betData);
    }

    autoPlaceBet() {
        this.handle();
    }

    isInPhasePreventBet() {
        return false;
    }

    updateMultiplier(multiplier: number) {
        this.betsStore.multiplier = multiplier;
    }

    updatePressingKey(isPressingKey: boolean) {
        this.holdActionStore.isPressingKey = isPressingKey;
        // if (this.autoPlayStore.isAutoplay) {
        //     this.autoPlayStore.isAutoplay = false;
        // }
    }
}
