import gc from "@sg/game-client-base";
import { _decorator, Color, Label, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render } = Observer;
const { FormatUtils } = gc;

@ccclass("current_multiplier")
export class CurrentMultiplier extends ObserverComponent {
    @property(Label)
    lblCurrentMultiplier: Label = null;

    @property(Label)
    lblMultiplierStroke: Label = null;

    levelColorList = ["#47d4fa", "#dba923", "#f6214c"];
    level1Multiplier = 5;
    level2Multiplier = 10;

    onLoad() {
        super.onLoad();
        this.setVisibility(false);
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.setVisibility(true);
        this.setCurrMultiplierValue(multiplier);
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isPlacingBet)
    hideCurrentMultiplier(isPlacingBet: boolean) {
        if (isPlacingBet) {
            this.setVisibility(false);
        }
    }

    setVisibility(status: boolean) {
        this.getComponent(UIOpacity).opacity = status ? 255 : 0;
    }

    setCurrMultiplierValue(multiplier: number) {
        this.lblCurrentMultiplier.string = this.lblMultiplierStroke.string = `${FormatUtils.numberWithCommas(multiplier, 2, false)}x`;
        let color: string;
        if (multiplier <= this.level1Multiplier) {
            color = this.levelColorList[0];
        } else if (multiplier <= this.level2Multiplier) {
            color = this.levelColorList[1];
        } else {
            color = this.levelColorList[2];
        }

        this.lblCurrentMultiplier.color = new Color().fromHEX(color);
    }
}
