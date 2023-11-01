import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import { AutoPlayHandler } from "../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/handlers/auto-play-handler";
import { BalanceEffectHandlers } from "../../../../extensions/shared-components/assets/game/balance-effect/scripts/handlers/balance-effect-handlers";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { CurrentMultiplier } from "./current-multiplier";
import { RocketFly } from "./rocket-fly/rocket-fly";
import { StatisticsBar } from "./statistics-bar/statistics-bar";

const { Settlements, Auth, Rounds, Translator, CrashCashOut } = gc;

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

    @property(Node)
    nodeStatisticsBar: Node = null;

    @property(Node)
    nodeCurrMultiplier: Node = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    private cpnRocketFly: RocketFly = null;
    private readonly smallExplosion = 1.02;
    private cpnStatisticsBar: StatisticsBar;
    private cpnCurrMultiplier: CurrentMultiplier;

    onLoad() {
        super.onLoad();
        this.cpnRocketFly = this.rocketFly.getComponent(RocketFly);
        this.cpnStatisticsBar = this.nodeStatisticsBar.getComponent(StatisticsBar);
        this.cpnCurrMultiplier = this.nodeCurrMultiplier.getComponent(CurrentMultiplier);
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    handleResult(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result, settlementResult } = data;
        if (!result) {
            return;
        }

        this.showResult(result, true).then(() => {
            setTimeout(() => {
                this.updateAutoPlayMode();
            }, 2000);
            this.finishShowResult(result, settlementResult);
        });
        this.resetValueCashout();
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        const multiplier = +result;
        this.cpnRocketFly?.explodeRocket(multiplier < this.smallExplosion);
        this.updateStatisticsBar(multiplier);
        this.updateCurrMultiplier(multiplier);
    }

    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        super.finishShowResult(result, settlementResult);
    }

    @handle(AutoPlayHandler, (handle) => handle.checkFinishedPlayMode())
    updateAutoPlayMode() {}

    @render(Settlements.SettlementStatusStore, (store) => store.settlementStatus)
    showPayoutForMainPlayer(settlementStatus) {
        if (settlementStatus?.win) {
            this.mainPlayerIncreaseBalance(settlementStatus?.bet);
            this.mainPlayerPlayWinningEffect();
            this.getBalance();
        }
    }

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(BalanceEffectHandlers.MainPlayerWinEffect)
    mainPlayerPlayWinningEffect() {
        return true;
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}
    updateStatisticsBar(value: number) {
        this.cpnStatisticsBar.updateMultiplierValue(value);
    }

    updateCurrMultiplier(value: number) {
        this.cpnCurrMultiplier.setCurrMultiplierValue(value);
    }

    @handle(CrashCashOut.CrashCashOutUIHandlers, (handle) => handle.resetCashoutVaue())
    resetValueCashout() {}
}
