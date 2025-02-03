import { _decorator, Component, Node, Prefab, Label, instantiate } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer"; 

import { CashOutHistoryStore } from '../cash-out-history-store';

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class CashOutHistory extends ObserverComponent {
    @property(Prefab)
    lblCashOutHistory: Prefab = null;

    @property(Node)
    cashOutHistoryPanel: Node = null;

    @render(CashOutHistoryStore, (store) => store.cashOutHistory)
    updateCashOutHistory(cashOutHistory: number[]) {
        this.cashOutHistoryPanel.removeAllChildren();
        [...cashOutHistory].reverse().forEach((item, index) => {
            const lblCashOutHistory = instantiate(this.lblCashOutHistory);
            lblCashOutHistory.getComponent(Label).string = `${item.toString()}x`;
            lblCashOutHistory.setPosition(0, index * -40);
            this.cashOutHistoryPanel.addChild(lblCashOutHistory);
        });
    }
}


