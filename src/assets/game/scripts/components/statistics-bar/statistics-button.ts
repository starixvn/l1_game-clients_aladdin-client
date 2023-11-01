import gc from "@sg/game-client-base";
import { Component, Label, Sprite, SpriteAtlas, _decorator } from "cc";
const { ccclass, property } = _decorator;
const { FormatUtils } = gc;
@ccclass
export class StatisticsButton extends Component {
    @property(Sprite)
    nodeBg: Sprite = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    public roundInfo = null;

    setData(data: any) {
        this.lblMultiplier.string = `${FormatUtils.numberWithCommas(+data, 2, false)}x`;
        this.setSpriteBg(+data);
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
}
