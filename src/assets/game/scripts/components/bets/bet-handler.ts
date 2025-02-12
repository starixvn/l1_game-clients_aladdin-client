import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { BetStore } from "./bet-store";

const { injectable, inject } = inversify;

enum BetAction {
    Bet = "bet",
    Mine = "mine",
}

@injectable()
export class BetHandler extends gc.Bet.BetHandler implements gc.Shared.IMultipleHandlers {
    @inject(BetStore) protected readonly betsStore: BetStore;
    @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore;
    @inject(gc.Bet.BetResponseHandlers) protected readonly betResponseHandlers: gc.Bet.BetResponseHandlers;
    @inject(gc.RoundBasePF.ProvablyFairStore) protected readonly pfStore: gc.RoundBasePF.ProvablyFairStore;

    handle() {
        const betData: any = this.createCommonBetData();
        betData.action = this.betsStore.betCount === 0 ? BetAction.Bet : BetAction.Mine;
        betData.clientSeed = this.pfStore.clientSeed;
        this.betsStore.betCount++;
        this.handleBetData(betData);
    }

    handleBetData(data: any) {
        const amount = data.amount;
        const isValid = data.action === BetAction.Bet ? this.isValidBet(amount) : true;

        if (isValid) {
            this.betStore.isProcessingBet = true;
            this.connectionStore.send(gc.GameClientEmitMessage.Bet.eventName, data);
            this.retryGameHandler.handle();
        }
    }

    isValidBet(amount: number) {
        if (this.betStore.isProcessingBet) {
            this.showWarningProcessingBet();
            return false;
        }

        const availableBalance = this.betStore.availableBalance;
        if (this.gameSetting?.validateBalanceWhenBet && amount > availableBalance) {
            this.showNoticePlaceBetFailure();
            return false;
        }

        return true;
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

    updateIsCrash(isCrash: boolean) {
        this.betsStore.isCrash = isCrash;
    }

    updateEndBet(endBet: number) {
        this.betsStore.endBet = endBet;
    }

    updateStatusStart(isStart: boolean) {
        this.betsStore.isStart = isStart;
    }

    resetBet() {
        this.betsStore.betCount = 0;
        this.betsStore.win = false;
        this.updateMultiplier(0);
        this.updateEndBet(0);
        this.updateIsCrash(false);
    }

    updateRoundId(roundId: number) {
        this.betsStore.roundId = roundId;
    }

    override isInPhasePreventBet() {
        return false;
    }

    handleCashOut() {
        this.connectionStore.send("cashOut", {});
        this.updateEndBet(0);
    }

    handleEndBet(endBet: number) {
        this.updateEndBet(endBet);
        this.updateMultiplier(1.01);
    }

    handleMine(multiplier: number) {
        this.updateMultiplier(multiplier);
    }

    handleEventCashOut(status: GameServiceMessage.Status) {
        this.updateStatusStart(false);
        this.updateStatusBet(status);
        this.updateIsCrash(!status.win);
    }

    handleRoundId(roundId: number) {
        this.updateRoundId(roundId);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.EndBetEvent,
            handle: this.handleEndBet,
        },
        {
            name: GameServiceMessage.MultiplierEvent,
            handle: this.handleMine,
        },
        {
            name: GameServiceMessage.Status.eventName,
            handle: this.handleEventCashOut,
        },
        {
            name: GameServiceMessage.RoundId,
            handle: this.handleRoundId,
        },
    ];
}
