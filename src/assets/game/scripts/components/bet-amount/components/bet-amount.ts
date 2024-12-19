import gc from "@sg/game-client-base";
import { _decorator, instantiate, Label, Node, Prefab, tween, v3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetAmountHandlers } from "../bet-amount-handlers";
import { BetAmountStore } from "../bet-amount-store";
import BetLevelsContainer from "./bet-levels-container";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class BetAmount extends ObserverComponent {
    @property(Node)
    nodeBetLevelsContainer: Node = null;

    @property(Prefab)
    prfBetLevelsContainer: Prefab = null;

    @property(Label)
    lblBetLevelDefault: Label = null;

    private betLevelsContainer: BetLevelsContainer = null;

    onLoad() {
        super.onLoad();
        gc.initMobxLogger();
        const configs = new gc.GameServiceMessage.GameConfigs();
        configs.betLevels = [1, 5, 10, 50, 100, 200, 500, 1000, 2000];
        configs.minBet = 1;
        configs.maxBet = 2000;
        configs.defaultBetLevel = 100;
        this.setGameConfigs(configs);
    }

    @handle(BetAmountHandlers)
    setGameConfigs(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        return gameConfigs;
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.defaultBetLevel)
    showDefaultBetLevel(defaultBetLevel: number) {
        this.lblBetLevelDefault.string = defaultBetLevel.toString();
    }

    @render(BetAmountStore, (store) => store.betAmount)
    renderBetAmount(betAmount: number) {
        this.lblBetLevelDefault.string = betAmount.toString();
    }

    @render(gc.GameConfigs.GameConfigStore, (store) => store.betLevels)
    assignBetLevel(betLevels: number[]) {
        this.nodeBetLevelsContainer.destroyAllChildren();
        const container = instantiate(this.prfBetLevelsContainer);
        this.betLevelsContainer = container.getComponent(BetLevelsContainer);
        this.betLevelsContainer.setBetLevels(betLevels);
        this.nodeBetLevelsContainer.addChild(container);
    }

    hideBetLevelsContainer() {
        if (!this.nodeBetLevelsContainer) {
            return;
        }

        tween(this.nodeBetLevelsContainer)
            .to(0.2, { scale: v3(1, 0, 0) })
            .call(() => {
                this.nodeBetLevelsContainer.active = false;
            })
            .start();
    }

    showBetLevelsContainer() {
        if (!this.nodeBetLevelsContainer) {
            return;
        }
        this.nodeBetLevelsContainer.active = true;
        this.nodeBetLevelsContainer.setScale(1, 0, 0);
        tween(this.nodeBetLevelsContainer)
            .to(0.2, { scale: v3(1, 1, 0) })
            .start();
    }

    onBetLevelButtonClick() {
        const isShowing = this.isShowStakeLevels();
        if (!isShowing) {
            this.showBetLevelsContainer();
        } else {
            this.hideBetLevelsContainer();
        }
    }

    isShowStakeLevels(): boolean {
        return this.nodeBetLevelsContainer && this.nodeBetLevelsContainer.active && this.nodeBetLevelsContainer.scale.y === 1;
    }
}
