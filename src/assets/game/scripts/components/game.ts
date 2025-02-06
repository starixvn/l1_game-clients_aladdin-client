import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { FunctionUtils } from "db://shared-components/shared/utils";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { EffectContainer } from "./win/effect-container";
import { BetStore } from "./bets/bet-store";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

export interface IWinInstantResult {
    betWin: number;
    bigWin: true;
}

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property(Node)
    nodeEffectContainer: Node = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    effectContainer: EffectContainer = null;

    onLoad() {
        super.onLoad();
    }

    @render(BetStore, (store) => store.roundId)
    renderRoundId(roundId: number) {
        this.lblRoundId && roundId !== 0 && (this.lblRoundId.string = `#${roundId}`);
    }
}
