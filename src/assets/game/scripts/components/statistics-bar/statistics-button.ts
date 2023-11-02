import gc from "@sg/game-client-base";
import { Label, Sprite, SpriteAtlas, _decorator } from "cc";
import Observer from "observer";
import { Md5PopupHandler } from "../../../../../extensions/shared-components/assets/game-crash/md5-popup/scripts/handlers/md5-popup-handlers";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

import { CrashRoundHistory } from "./statistics-bar";
const { ccclass, property } = _decorator;
const { FormatUtils } = gc;
const { render, handle } = Observer;
@ccclass
export class StatisticsButton extends ObserverComponent {
    @property(Sprite)
    nodeBg: Sprite = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    public roundInfo = null;
    private data: CrashRoundHistory = null;

    setMultiplier(data: number) {
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(+data, 2, false)}x`;
        this.setSpriteBg(+data);
    }

    setData(data: CrashRoundHistory) {
        this.data = data;
    }

    setSpriteBg(multiplier: number) {
        let sufix = "";
        if (multiplier <= 5) {
            sufix = "blue";
        } else if (multiplier <= 10) {
            sufix = "yelow";
        } else {
            sufix = "red";
        }
        this.nodeBg.spriteFrame = this.mainAtlas.getSpriteFrame(`statistics-bar-${sufix}`);
    }

    @handle(Md5PopupHandler, (handle, info: { isCrashed: number; isOpenPopupMd5: boolean; data: CrashRoundHistory }) =>
        handle.handleMd5Popup(info)
    )
    onClickStatisticsButton() {
        return { isCrashed: 2, isOpenPopupMd5: true, data: this.data };
    }
}
