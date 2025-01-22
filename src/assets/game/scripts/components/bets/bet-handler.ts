import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetStore } from "./bet-store";
import { GameServiceMessage } from "../../game-message";
import { BalanceInfoHandler } from "../balance/balance-info-handler";
import { handle } from "observer";

const { injectable, inject } = inversify;

@injectable()
export class BetHandler extends gc.Bet.BetHandler {
    @inject(BetStore) protected readonly betsStore: BetStore;
    @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore;
    @inject(gc.Bet.BetResponseHandlers) protected readonly betResponseHandlers: gc.Bet.BetResponseHandlers;

    handle() {
        const betData: any = this.createCommonBetData();
        betData.action = this.betsStore.betCount === 0 ? "bet" : "mine";
        this.betsStore.betCount++;
        this.handleBetData(betData);
    }

    updateMultiplier(multiplier: number) {
        this.betResponseHandlers.stopProcessingBetAndClearInterval();
        this.betsStore.multiplier = multiplier;
    }

    updateStatusBet(status: GameServiceMessage.Status) {
        this.betResponseHandlers.stopProcessingBetAndClearInterval();
        this.betsStore.win = status.win;
        this.betsStore.reachMaxWin = status.reachMaxWin;
        this.betsStore.bet = status.bet;
    }

    updateEndBet(endBet: number) {
        this.betsStore.endBet = endBet;
    }

    updateStatusStart(isStart: boolean) {
        this.betsStore.isStart = isStart;
    }

    resetBet() {
        this.betsStore.betCount = 0;
        this.updateMultiplier(0);
        this.updateEndBet(0);
    }

    override isInPhasePreventBet() {
        return false;
    }   

    handleCashOut() {
        this.connectionStore.send("cashOut", {});
    }
}

@injectable()
export class EndBetHandler implements gc.Shared.IMultipleHandlers {
    @inject(BetHandler) protected readonly betHandler: BetHandler;
    handleEndBet(endBet: number) {
        this.betHandler.updateEndBet(endBet);
        this.betHandler.updateMultiplier(1.01);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.EndBetEvent,
            handle: this.handleEndBet,
        },
    ];
}

@injectable()
export class MineHandler implements gc.Shared.IMultipleHandlers {
    @inject(BetHandler) protected readonly betHandler: BetHandler;
    handleMine(multiplier: number) {
        this.betHandler.updateMultiplier(multiplier);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.MultiplierEvent,
            handle: this.handleMine,
        },
    ];
}

@injectable()
export class CashOutHandler implements gc.Shared.IMultipleHandlers {
    @inject(BetHandler) protected readonly betHandler: BetHandler;
    handleCashOut(status: GameServiceMessage.Status) {
        this.betHandler.updateStatusBet(status);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Status.eventName,
            handle: this.handleCashOut,
        },
    ];
}