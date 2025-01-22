import gc from "@sg/game-client-base";
import { _decorator, instantiate, Layout, Node, Prefab, UITransform } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import BetLevelItem from "./bet-level-item";
import { BetAmountStore } from "../bet-amount-store";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class BetLevelsContainer extends ObserverComponent {
    @property(Node)
    content: Node = null;

    @property(Prefab)
    prfBetLevelItem: Prefab = null;

    private betLevels: number[] = [];
    private readonly itemHeight = 60;
    private readonly itemsOfColumnMax = 4;
    private readonly itemSpacing = 10;

    setBetLevels(betLevels: number[]) {
        if (betLevels.length <= 0) {
            return;
        }
        betLevels.sort((a, b) => a - b);
        this.betLevels = betLevels;
        this.initBetLevelItems();
        this.calculateContainerHeight();
        this.content.getComponent(Layout).updateLayout();
    }

    initBetLevelItems() {
        this.betLevels.forEach((value) => {
            const node = instantiate(this.prfBetLevelItem);
            this.content.addChild(node);

            const itemComp = node.getComponent(BetLevelItem);
            itemComp.setData(value);
        });
    }

    private calculateContainerHeight() {
        const numItems = Math.min(this.betLevels.length, this.itemsOfColumnMax);
        const numSpaces = numItems + 1;
        const totalHeight = (numItems * this.itemHeight) + (numSpaces * this.itemSpacing);
        
        this.content.getComponent(UITransform).height = totalHeight;
    }

    @render(BetAmountStore, (store) => store.stakeBetLevel)
    renderBetAmount(stakeBetLevel: number) {
        if (this.content.children.length <= 0) {
            return;
        }
        this.content.children.forEach((child) => {
            child.getComponent(BetLevelItem).setSelectedNode(false);
        });
        const index = this.betLevels.findIndex((amount) => amount === stakeBetLevel);
        const selectedNode = this.content.children[index];
        const comp = selectedNode.getComponent(BetLevelItem);
        comp.setSelectedNode(true);
    }
}
