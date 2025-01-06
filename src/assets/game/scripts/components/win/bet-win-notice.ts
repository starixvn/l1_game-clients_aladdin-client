import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from "cc";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-magager/bundle-manager";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;

@ccclass
export default class BetWinNotice extends Component {
    @property(Sprite)
    avatar: Sprite = null;

    @property(Label)
    lblBetWin: Label = null;

    async setAvatar(avatarId: number) {
        if (!this.avatar) {
            return true;
        }
        try {
            const spriteFrame = await bundleManager.loadSharedAsset<SpriteFrame>(`images/avatars/${avatarId}/spriteFrame`, SpriteFrame);
            if (spriteFrame) {
                this.avatar.spriteFrame = spriteFrame;
                this.avatar.node.active = true;
                return true;
            }
        } catch (error) {}
        return false;
    }

    setBetWin(betWin: number) {
        this.lblBetWin.string = `+ ${FormatUtils.numberWithCommas(betWin, 2)}`;

        const uiOpacity = this.node.getComponent(UIOpacity);
        uiOpacity.opacity = 255;
        const duration = 2;
        tween(uiOpacity)
            .delay(0.75 * duration)
            .to(0.25 * duration, { opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                this.node.destroy();
            })
            .start();

        tween(this.node)
            .by(
                duration,
                {
                    position: new Vec3(0, 200, 0),
                },
                { easing: "sineOut" }
            )
            .start();
    }
}
