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
    multiplierBottom = 0;
    multiplierTop = 0;
    multiplierIndex = 0;
    currentMaxMultiplierCol: number;
    multiplierContainerSize: UITransform;

    onLoad() {
        this.initDefaultMultiplier();
    }

    initDefaultMultiplier() {
        this.multiplierContainerSize = this.nodeMultipliersContainer.getComponent(UITransform);
        this.multiplierContainerSize.height = 0;
        this.nodeMultipliersContainer.destroyAllChildren();
        this.multiplierList = [];
        this.defaultMultiplierList.forEach((multiplier) => {
            this.addMultiplierItem(multiplier);
        });
    }

    addMultiplierItem(multiplier: number) {
        const node = instantiate(this.prfMultiplierItem);
        node.name = multiplier.toString();
        node && this.nodeMultipliersContainer.addChild(node);

        const itemPosY = this.multiplierContainerSize.height;
        node.position = v3(0, itemPosY, 0);
        this.multiplierContainerSize.height = this.multiplierItemHeight + itemPosY;

        const comp = node.getComponent(ColMultiplierItem);
        comp?.setMultiplier(multiplier);
        this.multiplierList.push(multiplier);
    }

    scrollDown(transitionY: number) {
        this.scrollTween?.stop();
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .by(0.1, {
                position: v3(0, -transitionY, 0),
            })
            .call(() => {
                if (this.multiplierIndex > this.multiplierList.length - 1) {
                    const removedNode = this.nodeMultipliersContainer.getChildByName(this.multiplierList[0].toString());
                    this.nodeMultipliersContainer.removeChild(removedNode);
                    this.multiplierList.shift();
                    const nextMultiplier = this.multiplierList[this.multiplierList.length - 1];
                    this.addMultiplierItem(nextMultiplier * 2);
                }
            })
            .start();
    }

    scrollUp() {
        this.initDefaultMultiplier();

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
        this.multiplierIndex = this.multiplierList.findIndex((element) => element > multiplier);
        this.multiplierTop = +this.multiplierList[this.multiplierIndex];
        this.multiplierBottom = +this.multiplierList[this.multiplierIndex - 1];
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
            this.scrollDown(calcMultiplierPosY - convertRocketWorldPos.y);
        }
    }
}
