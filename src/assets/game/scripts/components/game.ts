import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import { DemoHandler } from "../../../../extensions/shared-components/assets/game/bet-input/demo/demo-handlers";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";

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

    override namespace = settings.name;
    override containerOptions = containerOptions;

    onLoad(): void {
        super.onLoad();
        gc.initMobxLogger();
        const configs = new gc.GameServiceMessage.GameConfigs();
        configs.chips = ["1", "5", "10", "50", "100", "200", "500", "1000"];
        configs.minBet = 1;
        configs.maxBet = 1000;
        this.setDemoGameConfigs(configs);
    }

    @handle(DemoHandler)
    setDemoGameConfigs(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        return gameConfigs;
    }
}
