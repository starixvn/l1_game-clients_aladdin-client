import gc from "@sg/game-client-base";
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { CashOutHistoryStore } from './cash-out-history-store';
import { BetStore } from '../bets/bet-store';
import inversify from 'inversify';
const { injectable, inject } = inversify;

export enum VerificationMode {
    History = 0,
    LatestRounds = 1,
}

export class RoundPF {
    static eventName = "getProvablyFair";
}

@injectable()
export class CashOutHistoryHandlers {
    @inject(CashOutHistoryStore) protected readonly cashOutHistoryStore: CashOutHistoryStore;   
    @inject(BetStore) protected readonly betStore: BetStore;
    @inject(gc.RoundBasePF.ProvablyFairHandler) protected readonly provablyFairHandler: gc.RoundBasePF.ProvablyFairHandler;
    @inject(gc.RoundBasePF.ProvablyFairStore) protected readonly provablyFairStore: gc.RoundBasePF.ProvablyFairStore;
    @inject(gc.RoundPF.RoundPFHandler) protected readonly roundPFHandler: gc.RoundPF.RoundPFHandler;
    @inject(gc.Connection.ConnectionStore) protected readonly connectionStore: gc.Connection.ConnectionStore;

    private maxCashOutHistory = 10;

    updateCashOutHistory(cashOutHistory: number[]) {
        this.cashOutHistoryStore.cashOutHistory = cashOutHistory;
    }

    addCashOutHistory() {
        let cashOutHistory = [...this.cashOutHistoryStore.cashOutHistory];
        cashOutHistory.push({
            multiplier: this.betStore.multiplier,
            roundId: this.betStore.roundId
        });
        if (cashOutHistory.length > this.maxCashOutHistory) {
            cashOutHistory.shift();
        }
        this.updateCashOutHistory(cashOutHistory);
    }

    openVerificationHistory(roundId: number) {
        this.roundPFHandler.requestForCurrentRound = false;
        this.connectionStore.send(RoundPF.eventName, { roundId });
        this.provablyFairStore.openVerification = { mode: VerificationMode.History, roundId };
    }

    resetCashOutHistory() {
        this.cashOutHistoryStore.cashOutHistory = [];
    }
}


