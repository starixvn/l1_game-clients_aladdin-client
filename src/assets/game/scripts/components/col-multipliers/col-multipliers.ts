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
    removedList = [];
    multiplierItemHeight = 178;
    scrollTween: Tween<Node>;
    multiplierBottom = 0;
    multiplierTop = 0;
    multiplierTopIndex = 0;
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
            this.addItem(multiplier);
        });
    }

    addItem(multiplier: number) {
        console.log("add multiplier: " + multiplier);
        const node = instantiate(this.prfMultiplierItem);
        node.name = multiplier.toString();
        node && this.nodeMultipliersContainer.addChild(node);

        const itemPosY = this.multiplierContainerSize.height;
        node.position = v3(0, itemPosY, 0);
        this.multiplierContainerSize.height = this.multiplierItemHeight + itemPosY;
        // console.log(`multiplierContainerSize: ${this.multiplierContainerSize.height}`);
        const comp = node.getComponent(ColMultiplierItem);
        comp?.setMultiplier(multiplier);
        this.multiplierList.push(multiplier);
    }

    scrollDown(transitionY: number) {
        console.log("scrollDown  : " + transitionY);
        this.scrollTween?.stop();
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .by(0.1, {
                position: v3(0, -transitionY, 0),
            })
            .start();
    }

    private addNewMultiplier() {
        const nextMultiplier = this.multiplierList[this.multiplierList.length - 1];
        this.addItem(nextMultiplier * 2);
    }

    private removeFirstMultiplier() {
        const firstMultiplier = this.multiplierList[0];
        const removedNode = this.nodeMultipliersContainer.getChildByName(firstMultiplier.toString());
        this.nodeMultipliersContainer.removeChild(removedNode);
        this.multiplierList.shift();
        this.removedList.push(firstMultiplier);
    }

    scrollUp() {
        this.multiplierTopIndex = 0;
        this.scrollTween?.stop();
        this.scrollTween = tween(this.nodeMultipliersContainer)
            .call(() => {
                this.initDefaultMultiplier();
                this.removedList = [];
            })
            .delay(0.1)
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
        const currentIndex = this.multiplierList.findIndex((element) => element > multiplier);

        if (currentIndex != this.multiplierTopIndex) {
            console.log(`change top index ${this.multiplierTopIndex}  ==> ${currentIndex}`);
            if (currentIndex === this.multiplierList.length - 3) {
                this.addNewMultiplier();
            }
            this.multiplierTopIndex = currentIndex;
            this.multiplierTop = +this.multiplierList[this.multiplierTopIndex];
            this.multiplierBottom = +this.multiplierList[this.multiplierTopIndex - 1];
        }

        return (multiplier - this.multiplierBottom) * (this.multiplierItemHeight / (this.multiplierTop - this.multiplierBottom));
    }

    convertWorldPosition(node: Node) {
        return node?.getComponent(UITransform)?.convertToWorldSpaceAR(v3(0, 0, 0));
    }
    needScrollDown(rocket: Node, multiplier: number) {
        const convertRocketWorldPos = this.convertWorldPosition(rocket);
        const multiplierHeight = this.calcMultipplierHeight(multiplier);
        const multiplierBottomNode = this.nodeMultipliersContainer.getChildByName(`${this.multiplierBottom}`);
        console.log(`multiplier ${multiplier} bottom ${multiplierBottomNode.name}`);
        const calcMultiplierPosY = this.convertWorldPosition(multiplierBottomNode)?.y + multiplierHeight;

        let prefix = "";
        if (convertRocketWorldPos && calcMultiplierPosY > convertRocketWorldPos.y) {
            this.scrollDown(calcMultiplierPosY - convertRocketWorldPos.y);
        } else {
            prefix = "----";
        }

        // console.log(
        //     `${prefix} multiplier: ${multiplier},convertRocketWorldPos: ${convertRocketWorldPos.y}, calcMultiplierPosY: ${calcMultiplierPosY}`
        // );
    }
}
