import { _decorator, Component, Sprite, SpriteAtlas } from "cc";
const { ccclass, property } = _decorator;

export class CrashUtils extends Component {
    static SetSpriteFrameBg(multiplier: number, nodeBg: Sprite, mainAtlas: SpriteAtlas) {
        let sufix = "";
        if (multiplier <= 5) {
            sufix = "blue";
        } else if (multiplier <= 10) {
            sufix = "yelow";
        } else {
            sufix = "red";
        }
        nodeBg.spriteFrame = mainAtlas.getSpriteFrame(`statistics-bar-${sufix}`);
    }
}
