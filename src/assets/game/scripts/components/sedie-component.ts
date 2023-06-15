import { Label, _decorator, tween } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import Observer from "observer";
import { startGame } from "../../../../extensions/shared-components/assets/shared/scripts/startup";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../sedie-settings";
import { SediePlate } from "./sedie-plate";

const { ccclass, property } = _decorator;
const { observer } = Observer;

@ccclass
@observer(settings.name)
export default class Sedie extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(SediePlate)
    cpnThePlate: SediePlate = null;

    showResult(result: any, hasAnimation: boolean) {
        if (result) {
            this.cpnThePlate.setDots(result);
            this.cpnThePlate.openBowl(hasAnimation);
            if (hasAnimation) {
                tween(this.node)
                    .delay(this.cpnThePlate.openPlateDuration)
                    .call(() => {
                        this.finishShowResult();
                    })
                    .start();
            }
        }
    }

    startGenerateResult(isStartGenerateResult: boolean) {
        if (isStartGenerateResult) {
            super.startGenerateResult(isStartGenerateResult);
            this.cpnThePlate.closeBowl(true);
            this.cpnThePlate.shakePlate();
        }
    }

    refreshContainer() {
        startGame(settings.name, containerOptions, siteConfigs);
    }
}
