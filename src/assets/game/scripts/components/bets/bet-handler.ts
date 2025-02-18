import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { settings } from "../../game-settings";
import { BetStore, BetUIState } from "./bet-store";

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

    private readonly BIG_WIN_MULTIPLIER = 2.5;
    private autoCashOutTimeOut = null;

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
        } else {
            this.resetBet();
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

        this.betsStore.settleStatus = { ...status, isBigWin: this.betsStore.multiplier >= this.BIG_WIN_MULTIPLIER };
    }

    updateEndBet(endBet: number) {
        this.betsStore.endBet = endBet;
    }

    changeStarted() {
        this.betsStore.uiState = BetUIState.Started;
        this.handleMine(1.0);
    }

    resetBet() {
        this.betsStore.betCount = 0;
        this.betsStore.uiState = BetUIState.Start;
        this.betsStore.reachMaxWin = false;
        this.betsStore.settleStatus = null;
        this.updateMultiplier(1.0);
        this.updateEndBet(0);
    }

    updateRoundId(roundId: number) {
        this.betsStore.roundId = roundId;
    }

    override isInPhasePreventBet() {
        return false;
    }

    handleCashOut() {
        this.clearAutoCashOut();
        this.connectionStore.send("cashOut", {});
    }

    handleEndBet(endBet: number) {
        if (endBet < 0) {
            this.resetBet();
            return;
        }
        this.updateEndBet(endBet);
        this.handleMine(1.01);
    }

    handleMine(multiplier: number) {
        if (multiplier === 0) {
            this.clearAutoCashOut();
            return;
        }
        if (multiplier >= 1.01) {
            this.betsStore.uiState = multiplier === 1.01 ? BetUIState.Bet : BetUIState.Mining;
            this.triggerAutoCashOut();
        }

        this.updateMultiplier(multiplier);
    }

    triggerAutoCashOut() {
        if (this.betsStore.autoCashOutEnable) {
            this.betsStore.resetAutoCashOutTimer();
            return;
        }

        this.betsStore.autoCashOutEnable = true;

        const countDown = () => {
            this.betsStore.autoCashOutTimer--;
            console.log(`auto cashout in ${this.betsStore.autoCashOutTimer}s`);
            if (this.betsStore.autoCashOutTimer <= 0) {
                this.handleCashOut();
            } else {
                this.autoCashOutTimeOut = setTimeout(countDown, 1000);
            }
        };

        this.autoCashOutTimeOut = setTimeout(countDown, 1000);
    }

    clearAutoCashOut() {
        this.autoCashOutTimeOut && clearTimeout(this.autoCashOutTimeOut);
        this.betsStore.autoCashOutEnable = false;
    }

    handleEventCashOut(status: GameServiceMessage.Status) {
        this.clearAutoCashOut();
        this.betsStore.reachMaxWin = false;
        this.betsStore.uiState = BetUIState.Settle;
        this.updateStatusBet(status);

        const delayResetBet = this.betsStore.settleStatus.win
            ? this.betsStore.settleStatus.isBigWin
                ? settings.durations.bigWinNotice
                : settings.durations.normalWinNotice
            : settings.durations.loseNotice;
        setTimeout(() => {
            this.resetBet();

            if (this.betsStore.isAutoStart) {
                this.changeStarted();
            }
        }, delayResetBet * 1000);
    }

    updateAutoStart() {
        this.betsStore.isAutoStart = !this.betsStore.isAutoStart;

        if (this.betsStore.isAutoStart && this.betsStore.uiState === BetUIState.Start) {
            this.changeStarted();
        }
    }

    handleRoundId(roundId: number) {
        this.updateRoundId(roundId);
    }

    handleReachMaxWin(reachMaxWin: boolean) {
        this.betsStore.reachMaxWin = reachMaxWin;
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
        {
            name: GameServiceMessage.ReachMaxWinEvent,
            handle: this.handleReachMaxWin,
        },
    ];
}
