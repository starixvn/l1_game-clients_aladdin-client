import gc from "@sg/game-client-base";
import { _decorator, sp } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const BackgroundType = {
    IDLE: "idle",
    ACTION: "action",
};

@ccclass("background_control")
export class BackgroundControl extends ObserverComponent {
    @property(sp.Skeleton)
    skeBackground: sp.Skeleton = null;

    private readonly maxMultiplierReach = 7;
    private isChangeAnim = false;

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    changeActionAnim(multiplier) {
        if (multiplier >= this.maxMultiplierReach && this.isChangeAnim === false) {
            this.skeBackground.setAnimation(0, BackgroundType.ACTION, true);
            this.isChangeAnim = true;
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    changeIdleAnim(isStartRound) {
        if (isStartRound && this.isChangeAnim === true) {
            this.skeBackground.setAnimation(0, BackgroundType.IDLE, true);
            this.isChangeAnim = false;
        }
    }
}
