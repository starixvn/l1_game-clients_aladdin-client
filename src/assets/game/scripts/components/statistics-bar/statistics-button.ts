import { Component, Label, Sprite, SpriteAtlas, _decorator } from "cc";
const { ccclass, property } = _decorator;

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
        const multiplier = data.result;
        this.lblMultiplier.string = `${multiplier}x`;
        this.setSpriteBg(+multiplier);
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
