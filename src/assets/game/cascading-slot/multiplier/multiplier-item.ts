import { _decorator, Animation, Component, Label, Sprite, SpriteAtlas } from "cc";
import { FunctionUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;

@ccclass
export class MultiplierItem extends Component {
    @property(Sprite)
    center: Sprite = null;

    @property(Sprite)
    centerGlow: Sprite = null;

    @property(SpriteAtlas)
    atlas: SpriteAtlas = null;

    @property(Label)
    value: Label = null;

    @property(Animation)
    animation: Animation = null;

    private _multiplierValue = 1;

    gameId: number;

    get multiplier() {
        return this._multiplierValue;
    }

    async playAnimationGlow() {
        try {
            this.animation.play();
            const duration = this.animation.defaultClip.duration;
            await FunctionUtils.delay(duration);
            this.hideMultiplier();
        } catch (e) {
            console.warn("Catch error after await method", e.message);
        }
    }

    setValue(value: number) {
        this._multiplierValue = value;
        this.value.string = `x${value}`;
        this.updateColor(value);
    }

    protected hideMultiplier() {
        this.value.node.active = false;
        this.animation.stop();
    }

    protected updateColor(value: number) {
        const color = ["green", "blue", "purple", "yellow"];
        let i = 0;
        const range = [10, 20, 30];
        for (; i < range.length; i++) {
            if (value <= range[i]) {
                break;
            }
        }
        const spriteName = `multiplier-${color[i]}`;
        this.center.spriteFrame = this.atlas.getSpriteFrame(spriteName);
        this.centerGlow.spriteFrame = this.atlas.getSpriteFrame(`${spriteName}-glow`);
    }
}
