import gc from "@sg/game-client-base";
import { _decorator, Label, tween, Vec3 } from "cc";
import { BalanceEffectHandlers } from "db://shared-components/game/balance-effect/scripts/handlers/balance-effect-handlers";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { IWinInstantResult } from "../game";
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
const { Player, Bet, FormatUtils, Settlements } = gc;
const { MainPlayerStore } = Player;

@ccclass
export class BalanceInfo extends ObserverComponent {
    @property(Label)
    lblBalance: Label = null;

    @render(MainPlayerStore, (store) => store.balance)
    setBalance(value: number) {
        this.lblBalance && (this.lblBalance.string = FormatUtils.truncateFixedDecimals(value, 2).toString());
        tween(this.lblBalance.node)
            .to(0.1, { scale: new Vec3(0.55, 0.55, 1) })
            .to(0.1, { scale: new Vec3(0.5, 0.5, 1) })
            .start();
    }

    @render(Bet.BetStore, (store) => store.lastReceivedBet)
    endBetInfo(lastReceivedBet: gc.Bet.ILastReceivedBet) {
        if (lastReceivedBet && lastReceivedBet.value > 0 && lastReceivedBet.isAnimated) {
            this.mainPlayerDecreaseBalance(lastReceivedBet.value);
        }
    }

    @handle(BalanceEffectHandlers.MainPlayerDecreaseBalance)
    mainPlayerDecreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @render(Settlements.SettlementStore, (store) => store.result, { fireImmediately: false })
    showPayout(result: IWinInstantResult) {
        this.mainPlayerIncreaseBalance(result.betWin);
    }
}
