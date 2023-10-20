import { _decorator, instantiate, Node, Prefab, Tween, tween, UITransform, v3 } from "cc";
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

    defaultMultiplierList = [1, 2, 3, 4, 8];
    multiplierList = [];
    multiplierItemHeight = 178;
    scrollTween: Tween<Node>;
    scrollDownDuration = 0.1;
    scrollTime = 0;
    currentMaxMultiplierCol = this.defaultMultiplierList[this.defaultMultiplierList.length - 1];

    onLoad() {
        super.onLoad();
        this.initDefaultMultiplier();
    }

    initDefaultMultiplier() {
        this.nodeMultipliersContainer.destroyAllChildren();
        this.defaultMultiplierList.forEach((multiplier) => {
            this.addMultiplierItem(`${multiplier}`);
            this.multiplierList.push(multiplier);
        });
    }

    addMultiplierItem(multiplier: string) {
        const node = instantiate(this.prfMultiplierItem);
        node.name = multiplier;
        const comp = node.getComponent(ColMultiplierItem);
        comp && comp.setMultiplier(multiplier);
        this.nodeMultipliersContainer.addChild(node);
    }

    startScrollDown(transitionY: number) {
        this.scrollTween && this.scrollTween.stop();
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .by(
                this.scrollDownDuration,
                {
                    position: v3(0, -transitionY, 0),
                },
                { easing: "sineOut" }
            )
            .start();
        // const pos = this.nodeMultipliersContainer.position;
        // this.nodeMultipliersContainer.position = v3(pos.x, pos.y - transitionY, pos.z);
    }

    stopScrollDown() {
        this.scrollTween && this.scrollTween.stop();
        this.currentMaxMultiplierCol = this.defaultMultiplierList[this.defaultMultiplierList.length - 1];
        this.nodeMultipliersContainer.position = v3(this.nodeMultipliersContainer.position.x, 0, this.nodeMultipliersContainer.position.z);
    }

    convertRocketPositionToMultiplierCol(transformRocket: UITransform) {
        return this.nodeMultipliersContainer
            .getComponent(UITransform)
            .convertToNodeSpaceAR(transformRocket.convertToWorldSpaceAR(v3(0, 0, 0)));
    }

    calcMultipplierPosition(multiplier: number) {
        const multiplierIndex = this.multiplierList.findIndex((element) => element > multiplier);
        const multiplierTop = +this.multiplierList[multiplierIndex];
        const multiplierBottom = +this.multiplierList[multiplierIndex - 1];
        const deltaMultiplier = multiplierTop - multiplierBottom;
        let multiplierHeight = (multiplier - 1) * (this.multiplierItemHeight / deltaMultiplier);

        return multiplierHeight;
    }

    needChangePosition(rocket: Node, multiplier: number) {
        const convertRocketPosition = this.convertRocketPositionToMultiplierCol(rocket.getComponent(UITransform));
        const rocketY = convertRocketPosition.y;

        const multiplierPos = this.calcMultipplierPosition(multiplier);
        console.log(`rocketY: ${rocketY}, multiplierPos: ${multiplierPos}`);

        if (multiplierPos > rocketY) {
            console.log(`--- rocketY: ${multiplierPos - rocketY}`);
            this.startScrollDown(multiplierPos - rocketY);
        }
    }
}
