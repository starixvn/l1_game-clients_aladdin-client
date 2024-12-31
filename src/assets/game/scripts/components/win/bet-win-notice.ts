import gc from "@sg/game-client-base";
import { _decorator, Label, tween, UIOpacity, Vec3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";

const { FormatUtils } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class BetWinNotice extends ObserverComponent {
    @property(Label)
    lblBetWin: Label = null;

    setBetWin(betWin: number) {
        this.node.getComponent(UIOpacity).opacity = 255;
        this.lblBetWin.string = `+ ${FormatUtils.numberWithCommas(betWin, 2)}`;
        tween(this.node.getComponent(UIOpacity))
            .to(2, { opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                this.node.destroy();
            })
            .start();

        tween(this.node)
            .to(
                2,
                {
                    position: new Vec3(0, 200, 0),
                },
                { easing: "sineOut" }
            )
            .start();
    }
}
