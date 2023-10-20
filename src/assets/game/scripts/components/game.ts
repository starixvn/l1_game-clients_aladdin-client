import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { RocketFly } from "./rocket-fly/rocket-fly";

const { Settlements, Rounds, Translator } = gc;

const { movingNode, getPositionAtDestNode, playSpine, fadeOut, fadeIn } = AnimationUtils;

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property(Node)
    rocketFly: Node = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    cpnRocketFly: RocketFly = null;
    smallExplosion = 1.02;

    onLoad() {
        super.onLoad();
        this.cpnRocketFly = this.rocketFly.getComponent(RocketFly);
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result, settlementResult } = data;
        if (!result) {
            return;
        }
        this.showResult(result, true).then(() => {
            this.finishShowResult(result, settlementResult);
        });
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        this.cpnRocketFly?.explodeRocket(+result < this.smallExplosion);
    }

    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        super.finishShowResult(result, settlementResult);
    }
}
