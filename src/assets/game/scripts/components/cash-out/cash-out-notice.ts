import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ComponentUtils } from "../../../../../extensions/shared-components/assets/shared/utils";
import { PlayerActionHandlers } from "../player-actions/player-action-handlers";
const { ccclass, property } = _decorator;
const { handle, render } = Observer;

const { GameCrash, Rounds } = gc;

@ccclass
export class CashOutNotice extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;

    onLoad(): void {
        super.onLoad();
        this.node.active = false;
    }

    @render(GameCrash.CrashCashOut.CrashCashoutStore, (store) => store.cashOutNotice, { fireImmediately: false })
    updateCashoutAmount(amount: any) {
        this.showNotice(true);
        this.updateCashOutAmount(amount.value);
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            this.node.active = true;
            ComponentUtils.autoDisappear(this.node, false);
            setTimeout(() => {
                this.showHideNotice(true);
            }, 3000);
        } else {
            this.node.active = false;
        }
    }

    updateCashOutAmount(amount: number) {
        this.lblCashOut.string = amount.toString();
    }

    @handle(PlayerActionHandlers, (handle, flag: boolean) => handle.handleEndShowCashOutNotice(flag))
    showHideNotice(flag: boolean) {
        return flag;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    hideNotice(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.showHideNotice(false);
        }
    }
}
