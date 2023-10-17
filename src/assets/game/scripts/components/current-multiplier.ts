import gc from "@sg/game-client-base";
import { _decorator, Color, Label, UIOpacity } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("current_multiplier")
export class CurrentMultiplier extends ObserverComponent {
    @property(Label)
    lblCurrentMultiplier: Label = null;

    levelColorList = ["#47d4fa", "#dba923", "#f6214c"];
    level1Multiplier = 5;
    level2Multiplier = 10;

    onLoad() {
        super.onLoad();
        this.setCurrentMultiplierVisibility(false);
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.setCurrentMultiplierVisibility(true);
        this.lblCurrentMultiplier.string = `${multiplier}x`;

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

    @render(gc.Rounds.RoundTimeStore, (store) => store.startNewRound)
    hideCurrentMultiplier(startNewRound: boolean) {
        if (!startNewRound) {
            this.setCurrentMultiplierVisibility(false);
        }
    }

    setCurrentMultiplierVisibility(status: boolean) {
        this.getComponent(UIOpacity).opacity = status ? 255 : 0;
    }
}
