import { _decorator, Component, Node, Prefab, Label, instantiate, Color } from 'cc';
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

    private readonly MULTIPLIER_THRESHOLDS = {
        LEVEL_4: 110,
        LEVEL_3: 11,
        LEVEL_2: 1.2,
        LEVEL_1: 0
    };

    private readonly MULTIPLIER_COLORS = {
        LEVEL_4: "#CE02C0",
        LEVEL_3: "#FFBE00",
        LEVEL_2: "#00B815",
        LEVEL_1: "#0C00BA"
    };

    @render(CashOutHistoryStore, (store) => store.cashOutHistory)
    updateCashOutHistory(cashOutHistory: number[]) {
        this.cashOutHistoryPanel.removeAllChildren();
        [...cashOutHistory].reverse().forEach((item, index) => {
            const lblCashOutHistory = instantiate(this.lblCashOutHistory);
            const label = lblCashOutHistory.getComponent(Label);
            label.string = `${item.toString()}x`;
            
            const level = this.getCurrentAnimationLevel(item);
            label.color = new Color(this.MULTIPLIER_COLORS[`LEVEL_${level}`]);
            
            lblCashOutHistory.setPosition(0, index * -40);
            this.cashOutHistoryPanel.addChild(lblCashOutHistory);
        });
    }

    private getCurrentAnimationLevel(multiplier: number): number {
        const { LEVEL_4, LEVEL_3, LEVEL_2 } = this.MULTIPLIER_THRESHOLDS;
        if (multiplier >= LEVEL_4) return 4;
        if (multiplier >= LEVEL_3) return 3;
        if (multiplier >= LEVEL_2) return 2;
        return 1;
    }
}


