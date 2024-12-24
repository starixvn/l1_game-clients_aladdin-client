import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import WinNoticeContainer from "./win/win-notice-container";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer } = Observer;

export interface IWinInstantResult {
    betWin: number;
    bigWin: true;
}

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property(Node)
    nodeBetWin: Node = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    betWinNotice: WinNoticeContainer = null;

    onLoad() {
        super.onLoad();
        this.betWinNotice = this.nodeBetWin.getComponent(WinNoticeContainer);
    }

    async showResult(result: IWinInstantResult, hasAnimation: boolean, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        if (!result) {
            return;
        }
        const { betWin, bigWin } = result;
        if (result.betWin > 0) {
            this.betWinNotice.showBetWin(betWin);
        }
    }
    isValidResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return !!result;
    }
}
