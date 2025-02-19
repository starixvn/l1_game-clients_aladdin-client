import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Size, tween, UITransform, Vec3 } from "cc";
import MainPlayerProfile from "../../../../../extensions/shared-components/assets/game/main-player-profile/scripts/components/main-player-profile";
import Observer from "observer";
import { BalanceInfoHandler } from "./balance-info-handler";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const { Player, Bet, FormatUtils, Settlements } = gc;
const { MainPlayerStore } = Player;

@ccclass
export class BalanceInfo extends MainPlayerProfile {
    @property(Node)
    balanceFrame: Node = null;

    private minWidth: number = 180;
    private maxWidth: number = 210;

    onLoad() {
        super.onLoad();
    }

    @render(MainPlayerStore, (store) => store.balance)
    setUIBalance(balance: number) {
        if (balance.toString().length > 9) {
            this.lblBalance.overflow = Label.Overflow.SHRINK;
            const a = this.balanceFrame.getComponent(UITransform);
            a.setContentSize(new Size(this.maxWidth, 50));
        } else {
            this.lblBalance.overflow = Label.Overflow.NONE;
            const a = this.balanceFrame.getComponent(UITransform);
            const width = Math.min(Math.max(balance.toString().length * 30, this.minWidth), this.maxWidth);
            a.setContentSize(new Size(width, 50));
        }
    }
}
