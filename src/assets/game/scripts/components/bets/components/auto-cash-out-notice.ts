import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AudioIds } from "../../../../audios/AudioIds";
import { BetStore } from "../bet-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class AutoCashOutNotice extends ObserverComponent {
    @property(Label)
    lblTimer: Label = null;

    @render(BetStore, (store) => store.autoCashOutTimer)
    renderTimer(timer: number) {
        this.lblTimer.string = timer.toString();
    }
    @render(BetStore, (store) => store.autoCashOutTimerVisible)
    updateMultiplierVisible(autoCashOutTimerVisible: boolean) {
        this.node.active = autoCashOutTimerVisible;
        if (autoCashOutTimerVisible) {
            this.playSound(AudioIds.COUNTDOWN_CASHOUT);
        }
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSound(id: string) {
        return id;
    }
}
