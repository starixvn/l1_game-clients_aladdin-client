import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
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
}
