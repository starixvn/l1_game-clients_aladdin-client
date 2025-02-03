import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { CashOutHistoryStore } from './cash-out-history-store';
import { BetStore } from '../bets/bet-store';
import inversify from 'inversify';
const { injectable, inject } = inversify;

@injectable()
export class CashOutHistoryHandlers {
    @inject(CashOutHistoryStore) protected readonly cashOutHistoryStore: CashOutHistoryStore;   
    @inject(BetStore) protected readonly betStore: BetStore;

    updateCashOutHistory(cashOutHistory: number[]) {
        this.cashOutHistoryStore.cashOutHistory = cashOutHistory;
    }

    addCashOutHistory() {
        let cashOutHistory = [...this.cashOutHistoryStore.cashOutHistory];
        cashOutHistory.push(this.betStore.multiplier);
        if (cashOutHistory.length > 8) {
            cashOutHistory.shift();
        }
        this.updateCashOutHistory(cashOutHistory);
    }

    resetCashOutHistory() {
        this.cashOutHistoryStore.cashOutHistory = [];
    }
}


