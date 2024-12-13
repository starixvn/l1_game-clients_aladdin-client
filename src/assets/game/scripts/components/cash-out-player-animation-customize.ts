import gc from "@sg/game-client-base";
import { _decorator, Color, Label, sp } from "cc";

import { CashOutPlayerAnimation, ColorWinValue } from "db://shared-components/game-crash/cash-out-animation/cash-out-player-animation";
import Observer from "observer";
const { ccclass } = _decorator;
const { handle, render } = Observer;
const { FormatUtils } = gc;

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

    handleWinnings(spine: sp.Skeleton, winValue: number, isMainPlayer: boolean) {
        const lblWins = spine.node?.getComponentsInChildren(Label);
        if (!lblWins || lblWins.length === 0) {
            return;
        }

        const winColor = new Color().fromHEX(isMainPlayer ? ColorWinValue.MainPlayer : ColorWinValue.OtherPlayer);
        const formattedWinValue = FormatUtils.numberWithCommas(winValue, 2);
        lblWins.forEach((lblWin) => {
            const isUserLabel = lblWin.node.name === "user";

            if (isMainPlayer && isUserLabel) {
                lblWin.node.active = false;
            } else {
                lblWin.node.active = true;
            }

            lblWin.string = formattedWinValue;
            lblWin.color = winColor;
        });
    }
}
