import { _decorator, Component, instantiate, Node, Prefab, Tween, tween, UITransform, v3 } from "cc";
import Observer from "observer";

import { ColMultiplierItem } from "./col-multiplier-item";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class ColMultipliers extends Component {
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
    currentMaxMultiplierCol: number;

    onLoad() {
        this.initDefaultMultiplier();
    }

    initDefaultMultiplier() {
        this.nodeMultipliersContainer.destroyAllChildren();
        this.defaultMultiplierList.forEach((multiplier) => {
            this.addMultiplierItem(multiplier);
        });
    }

    addMultiplierItem(multiplier: number) {
        const node = instantiate(this.prfMultiplierItem);
        node.name = multiplier.toString();
        node && this.nodeMultipliersContainer.addChild(node);
        const comp = node.getComponent(ColMultiplierItem);
        comp?.setMultiplier(multiplier);
        this.multiplierList.push(multiplier);
    }

    startScrollDown(transitionY: number) {
        this.scrollTween?.stop();
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .by(
                this.scrollDownDuration,
                {
                    position: v3(0, -transitionY, 0),
                },
                { easing: "sineOut" }
            )
            .call(() => {
                if (this.nodeMultipliersContainer.position.y < -this.multiplierItemHeight * 2) {
                    // const removedNode = this.nodeMultipliersContainer.getChildByName(this.multiplierList[0].toString());
                    // this.nodeMultipliersContainer.removeChild(removedNode);
                    const nextMultiplier = this.multiplierList[this.multiplierList.length - 1];
                    this.addMultiplierItem(nextMultiplier * 2);
                }
            })
            .start();
    }

    stopScrollDown() {
        this.scrollTween?.stop();

        this.currentMaxMultiplierCol = this.defaultMultiplierList[this.defaultMultiplierList.length - 1];
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .to(
                1,
                {
                    position: v3(0, 0, 0),
                },
                { easing: "sineOut" }
            )
            .start();
    }

    calcMultipplierHeight(multiplier: number): number {
        const multiplierIndex = this.multiplierList.findIndex((element) => element > multiplier);
        this.multiplierTop = +this.multiplierList[multiplierIndex];
        this.multiplierBottom = +this.multiplierList[multiplierIndex - 1];
        const deltaMultiplier = this.multiplierTop - this.multiplierBottom;

        return (multiplier - this.multiplierBottom) * (this.multiplierItemHeight / deltaMultiplier);
    }

    convertWorldPosition(node: Node) {
        return node?.getComponent(UITransform)?.convertToWorldSpaceAR(v3(0, 0, 0));
    }
    needScrollDown(rocket: Node, multiplier: number) {
        const convertRocketWorldPos = this.convertWorldPosition(rocket);
        const multiplierHeight = this.calcMultipplierHeight(multiplier);
        const multiplierBottomNode = this.nodeMultipliersContainer.getChildByName(`${this.multiplierBottom}`);
        const calcMultiplierPosY = this.convertWorldPosition(multiplierBottomNode)?.y + multiplierHeight;

        if (convertRocketWorldPos && calcMultiplierPosY > convertRocketWorldPos.y) {
            this.startScrollDown(calcMultiplierPosY - convertRocketWorldPos.y);
        }
    }
}
