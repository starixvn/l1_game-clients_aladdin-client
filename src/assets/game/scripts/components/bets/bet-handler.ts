import gc from "@sg/game-client-base";
import inversify from "inversify";
import { AutoPlayStore } from "../auto-play/auto-play-store";
import { HoldActionStore } from "./hold-action-store";

const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
    @inject(HoldActionStore) protected readonly holdActionStore: HoldActionStore;
    @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore;
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

    updatePressingKey(isPressingKey: boolean) {
        this.holdActionStore.isPressingKey = isPressingKey;
        if (this.autoPlayStore.isAutoplay) {
            this.autoPlayStore.isAutoplay = false;
        }
    }
}
