import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, Tween, tween, v3 } from "cc";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { ColMultiplierItem } from "./col-multiplier-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class ColMultipliers extends ObserverComponent {
    @property(Node)
    nodeMultipliersContainer: Node = null;

    @property(Prefab)
    prfMultiplierItem: Prefab = null;

    defaultMultiplierList = ["1", "2", "4", "8", "16"];
    scrollHeight = 5;
    scrollTween: Tween<Node>;
    scrollDownDuration = 0.3;
    scrollTime = 0;
    currentMaxMultiplierCol = this.defaultMultiplierList[this.defaultMultiplierList.length - 1];

    onLoad() {
        super.onLoad();
        this.initDefaultMultiplier();
    }

    initDefaultMultiplier() {
        this.nodeMultipliersContainer.destroyAllChildren();
        this.defaultMultiplierList.forEach((multiplier) => {
            this.addMultiplierItem(multiplier);
        });
    }

    addMultiplierItem(multiplier: string) {
        const node = instantiate(this.prfMultiplierItem);
        const comp = node.getComponent(ColMultiplierItem);
        comp && comp.setMultiplier(multiplier);
        this.nodeMultipliersContainer.addChild(node);
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    updateScrollDownDuration(multiplier) {
        if (multiplier > 8 && this.scrollTime / 2 === 0) {
            this.currentMaxMultiplierCol = `${+this.currentMaxMultiplierCol * 2}`;
            this.addMultiplierItem(this.currentMaxMultiplierCol);
        }
    }

    startScrollDown() {
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .by(
                this.scrollDownDuration,
                {
                    position: v3(0, -this.scrollHeight, 0),
                },
                { easing: "sineOut" }
            )
            .call(() => {
                this.scrollTime += 2;
            })
            .union()
            .repeatForever()
            .start();
    }

    stopScrollDown() {
        this.scrollTween && this.scrollTween.stop();
        this.currentMaxMultiplierCol = this.defaultMultiplierList[this.defaultMultiplierList.length - 1];
        this.nodeMultipliersContainer.position = v3(this.nodeMultipliersContainer.position.x, 0, this.nodeMultipliersContainer.position.z);
    }
}
