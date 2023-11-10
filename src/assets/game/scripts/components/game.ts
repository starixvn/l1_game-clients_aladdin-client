import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import { AutoPlayHandler } from "../../../../extensions/shared-components/assets/game-crash/auto-play/scripts/handlers/auto-play-handler";
import { CurrentMultiplier } from "../../../../extensions/shared-components/assets/game-crash/current-multiplier";
import { BalanceEffectHandlers } from "../../../../extensions/shared-components/assets/game/balance-effect/scripts/handlers/balance-effect-handlers";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";

const { Settlements, Auth, Rounds, Translator, GameCrash } = gc;

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
    nodeCurrMultiplier: Node = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;

    private cpnCurrMultiplier: CurrentMultiplier;

    onLoad() {
        super.onLoad();
        this.cpnCurrMultiplier = this.nodeCurrMultiplier.getComponent(CurrentMultiplier);
    }

    override isValidResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return result;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        const multiplier = +result;
        this.updateCurrMultiplier(multiplier);
        setTimeout(() => {
            this.updateAutoPlayMode();
        }, 2000);
        this.resetValueCashout();
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

    updateCurrMultiplier(value: number) {
        this.cpnCurrMultiplier.setCurrMultiplierValue(value);
        this.cpnCurrMultiplier.showHideBottomText(true);
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (handle) => handle.resetCashoutVaue())
    resetValueCashout() {}
}
