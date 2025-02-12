import gc from "@sg/game-client-base";

import { _decorator, Component, Node, Prefab, Label, instantiate, Color } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer"; 

import { CashOutHistoryStore } from '../cash-out-history-store';
import { HashHandlers } from "../../hash/hash-handlers";
const { FormatUtils, GameCrash } = gc;

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

    private rounds: gc.RoundHistories.RoundHistory[]

    @render(gc.GameCrash.RoundHistory.CrashRoundHistoryStore, (store) => store, { fireImmediately: false })
    setRoundsInfo(rounds: gc.GameCrash.RoundHistory.CrashRoundHistoryStore) {
        this.rounds = rounds.roundHistories;
    }

    @render(CashOutHistoryStore, (store) => store.cashOutHistory)
    updateCashOutHistory(cashOutHistory: any[]) {
        this.cashOutHistoryPanel.removeAllChildren();
        [...cashOutHistory].reverse().forEach((item, index) => {
            const lblCashOutHistory = instantiate(this.lblCashOutHistory);
            const label = lblCashOutHistory.getComponentInChildren(Label);
            label.string = `${item.multiplier.toString()}x`;
            lblCashOutHistory.setPosition(0, index * -40);
            lblCashOutHistory.on(Node.EventType.TOUCH_END, () => {
                this.onClickRoundItem(item.roundId);
            });
            
            this.cashOutHistoryPanel.addChild(lblCashOutHistory);
        });
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundClick() {
        return gc.Audios.AudioIds.CLICK;
    }

    @handle(HashHandlers, (handle, roundId: number) => handle.openVerificationHistory(roundId))
    onClickRoundItem(roundId: number) {
        this.playSoundClick();
        return roundId;
    }

    private getCurrentAnimationLevel(multiplier: number): number {
        const { LEVEL_4, LEVEL_3, LEVEL_2 } = this.MULTIPLIER_THRESHOLDS;
        if (multiplier >= LEVEL_4) return 4;
        if (multiplier >= LEVEL_3) return 3;
        if (multiplier >= LEVEL_2) return 2;
        return 1;
    }
}


