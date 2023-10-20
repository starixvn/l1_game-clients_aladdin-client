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
    multiplierBottom = 0;
    multiplierTop = 0;
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
    }

    stopScrollDown() {
        this.scrollTween && this.scrollTween.stop();
        this.currentMaxMultiplierCol = this.defaultMultiplierList[this.defaultMultiplierList.length - 1];
        tween(this.nodeMultipliersContainer)
            .to(
                1,
                {
                    position: v3(0, 0, 0),
                },
                { easing: "sineOut" }
            )
            .start();
    }

    convertRocketPositionToMultiplierCol(transformRocket: UITransform) {
        return this.nodeMultipliersContainer
            .getComponent(UITransform)
            .convertToNodeSpaceAR(transformRocket.convertToWorldSpaceAR(v3(0, 0, 0)));
    }

    calcMultipplierHeight(multiplier: number) {
        const multiplierIndex = this.multiplierList.findIndex((element) => element > multiplier);
        this.multiplierTop = +this.multiplierList[multiplierIndex];
        this.multiplierBottom = +this.multiplierList[multiplierIndex - 1];
        const deltaMultiplier = this.multiplierTop - this.multiplierBottom;
        let multiplierHeight = (multiplier - this.multiplierBottom) * (this.multiplierItemHeight / deltaMultiplier);

        return multiplierHeight;
    }

    needChangePosition(rocket: Node, multiplier: number) {
        const convertRocketPositionWorld = rocket.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
        const rocketY = convertRocketPositionWorld.y;
        const multiplierHeight = this.calcMultipplierHeight(multiplier);
        const multiplierBottomNode = this.nodeMultipliersContainer.getChildByName(`${this.multiplierBottom}`);
        const multiplierY = multiplierBottomNode.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0)).y + multiplierHeight;

        if (multiplierY > rocketY) {
            this.startScrollDown(multiplierY - rocketY);
        }
    }
}
