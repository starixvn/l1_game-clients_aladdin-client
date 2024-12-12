import gc from "@sg/game-client-base";
import { _decorator } from "cc";

import { CashOutPlayerAnimation } from "db://shared-components/game-crash/cash-out-animation/cash-out-player-animation";
import Observer from "observer";
const { ccclass } = _decorator;
const { handle, render } = Observer;

@ccclass
export class CashOutPlayerAnimationCustomize extends CashOutPlayerAnimation {
    private readonly giftBoxDropSound = "giftbox_drop";
    protected getScalar() {
        return 0.9;
    }

    protected getRandomPositionY() {
        return this.currentPosition.y;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playGiftBoxDropSound() {
        return this.giftBoxDropSound;
    }

    @render(gc.GameCrash.CrashOtherPlayer.OtherPlayerStore, (store) => store.otherPlayer, { fireImmediately: false })
    playOtherPlayerCashOutSound(otherPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        this.playGiftBoxDropSound();
    }

    @render(gc.GameCrash.CrashCashOut.CrashCashOutStore, (store) => store.cashOutNotice, { fireImmediately: false })
    playerMainPlayerCashOutFullSound(cashOut: gc.GameCrash.GameCrashServiceMessage.CrashCashOut) {
        this.playGiftBoxDropSound();
    }
}
