import inversify from "inversify";
import gc from "@sg/game-client-base";
import { IHandler } from "observer";
import { PlayerActionStore } from "./player-action-store";
const { injectable, inject } = inversify;

@injectable()
export class PlayerActionHandlers implements IHandler<boolean> {
    @inject(PlayerActionStore)
    protected readonly playerActionStore: PlayerActionStore;

    @inject(gc.Bet.BetStore)
    protected readonly betStore: gc.Bet.BetStore;

    @inject(gc.Rounds.RoundTimeStore)
    protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;

    handle(flag: boolean) {}

    handleEndShowCashOutNotice(flag: boolean) {
        this.playerActionStore.endShowCashoutNotice = flag;
    }

    handleReceivedBet(isReceived: boolean) {
        this.playerActionStore.isReceivedBet = isReceived;
    }

    handleWaitingBet(flag: boolean) {
        this.playerActionStore.waitingBet = flag;
    }

    handleAutoPlay(flag: boolean) {
        this.playerActionStore.autoPlay = flag;
    }
}
