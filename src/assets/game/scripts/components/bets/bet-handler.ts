import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetStore } from "./bet-store";
import { GameServiceMessage } from "../../game-message";

const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
    @inject(BetStore) protected readonly betsStore: BetStore;
    @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore;

    handle() {
        const betData: any = this.createCommonBetData();
        betData.action = this.betsStore.betCount === 0 ? "bet" : "mine";
        this.betsStore.betCount++;
        this.handleBetData(betData);
    }

    updateMultiplier(multiplier: number) {
        this.betsStore.multiplier = multiplier;
    }

    updateStatusStart(isStart: boolean) {
        this.betsStore.isStart = isStart;
    }

    resetBetCount() {
        this.betsStore.betCount = 0;
    }

    override isInPhasePreventBet() {
        return false;
    }   

    handleCashOut() {
        this.connectionStore.send("cashOut", {});
    }
}

@injectable()
export class MineHandler implements gc.Shared.IMultipleHandlers {
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
