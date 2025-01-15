import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable, inject } = inversify;

@injectable()
export class BetStore extends gc.Bet.BetStore {
    multiplier = 0;
    isHittingOnCoin = false;
}

