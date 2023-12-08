import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import { PopupsHandlers } from "../../../../extensions/shared-components/assets/game-crash/popups/popups-handlers";
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

    override namespace = settings.name;
    override containerOptions = containerOptions;

    private readonly countDownSound = "count_down";

    onLoad() {
        super.onLoad();
    }

    override isValidResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        return result;
    }

    @handle(Settlements.SettlementUIHandlers.FinishedShowResult)
    finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        const multiplier = +result;
        this.updateCurrMultiplier(multiplier);
        super.finishShowResult(result, settlementResult);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        super.startNewRound(isStartRound);
        this.resetValueCashOutLeaderBoard();
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    handleStartPlacingBet(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.resetValueCashOutBetList();
    }

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

    @handle(GameCrash.CrashMultiplier.MultiplierHandlers, (handle, multiplier: number) => handle.handleMultiplierCrashed(multiplier))
    updateCurrMultiplier(value: number) {
        return value;
    }

    @handle(GameCrash.CrashCashOut.CrashCashOutUIHandlers, (handle) => handle.resetCashOutValue())
    resetValueCashOutLeaderBoard() {}

    @handle(GameCrash.CrashBetList.CrashBetListHandlers, (handler) => handler.resetMainPlayer())
    resetValueCashOutBetList() {}

    @handle(PopupsHandlers, (handle) => handle.closeAllPopups())
    closeAllPopups() {}

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    playSoundCountDown(roundTime: number) {
        if (roundTime > 0 && roundTime < 11) {
            this.playSound(this.countDownSound);
        }
    }
}
