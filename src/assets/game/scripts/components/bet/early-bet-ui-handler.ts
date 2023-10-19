import inversify from "inversify";
import { IHandler } from "observer";
import { EarlyBetStore } from "./early-bet-store";
import { BetInputStore } from "../../../../../extensions/shared-components/assets/game/bet-input/scripts/stores/bet-input-store";
const { injectable, inject } = inversify;

@injectable()
export class EarlyBetUIHandlers implements IHandler<boolean> {
    @inject(EarlyBetStore) private readonly earlyBetStore: EarlyBetStore;

    @inject(BetInputStore) private readonly betInputStore: BetInputStore;

    handle(enable: boolean) {
        this.earlyBetStore.betAmount = this.betInputStore.betAmount;
        this.earlyBetStore.earlyBet = enable;
        console.log("handle", this.earlyBetStore.betAmount, this.earlyBetStore.earlyBet);
    }
}
