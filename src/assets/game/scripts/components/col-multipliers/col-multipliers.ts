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
    startMultiplierList = [];
    multiplierList = [];
    removedList = [];
    multiplierItemHeight = 178;
    scrollTween: Tween<Node>;
    multiplierBottom = 0;
    multiplierTop = 0;
    multiplierContainerSize: UITransform;

    private createdDefaultMultiplierList = false;
    onLoad() {
        super.onLoad();
        this.startMultiplierList = this.defaultMultiplierList;
        this.initDefaultMultiplier();
    }

    createDefaultMultiplierList(multiplier: number) {
        if (this.createdDefaultMultiplierList) {
            return;
        }
        this.createdDefaultMultiplierList = true;
        multiplier = Math.floor(multiplier);
        if (multiplier / 4 > 8) {
            this.startMultiplierList = [
                Math.round(multiplier / 3),
                Math.round(multiplier / 1.5),
                multiplier,
                Math.round(multiplier * 1.5),
                Math.round(multiplier * 3),
            ];
            this.initDefaultMultiplier();
        }
    }

    initDefaultMultiplier() {
        this.multiplierContainerSize = this.nodeMultipliersContainer.getComponent(UITransform);
        this.multiplierContainerSize.height = 0;
        this.nodeMultipliersContainer.destroyAllChildren();
        this.multiplierList = [];
        this.startMultiplierList.forEach((multiplier) => {
            this.addItem(multiplier);
        });
        this.multiplierBottom = this.multiplierList[0];
        this.multiplierTop = this.multiplierList[1];
    }

    addItem(multiplier: number) {
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

    private findMultiplierIndex(multiplier: number): number {
        return this.multiplierList.findIndex((item) => item >= multiplier);
    }

    private addNewMultiplier() {
        const nextMultiplier = this.multiplierList[this.multiplierList.length - 1];
        this.addItem(Math.round(nextMultiplier * 1.5));
    }

    private removeFirstMultiplier() {
        const firstMultiplier = this.multiplierList[0];
        const removedNode = this.nodeMultipliersContainer.getChildByName(firstMultiplier.toString());
        this.nodeMultipliersContainer.removeChild(removedNode);
        this.multiplierList.shift();
        this.removedList.push(firstMultiplier);
    }

    scrollDown(transitionY: number, animated: boolean) {
        if (animated) {
            this.scrollTween?.stop();
            this.scrollTween = tween(this.nodeMultipliersContainer)
                .by(0.1, {
                    position: v3(0, -transitionY, 0),
                })
                .start();
        } else {
            this.nodeMultipliersContainer.position.add(v3(0, -transitionY, 0));
        }
    }

    scrollUp() {
        this.scrollTween?.stop();
        this.startMultiplierList = this.defaultMultiplierList;
        this.initDefaultMultiplier();
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

    handleMultiplier(multiplier: number) {
        const currentIndex = this.findMultiplierIndex(multiplier);
        const multiplierTop = this.multiplierList[currentIndex];

        if (multiplierTop != this.multiplierTop && currentIndex > 0) {
            if (currentIndex === this.multiplierList.length - 3) {
                this.addNewMultiplier();
            }

            if (this.findMultiplierIndex(this.multiplierBottom) > 10) {
                this.removeFirstMultiplier();
            }

            this.multiplierTop = this.multiplierList[currentIndex];
            this.multiplierBottom = this.multiplierList[currentIndex - 1];
        }
    }

    calcMultiplierHeight(multiplier: number): number {
        return (multiplier - this.multiplierBottom) * (this.multiplierItemHeight / (this.multiplierTop - this.multiplierBottom));
    }

    convertWorldPosition(node: Node) {
        return node?.getComponent(UITransform)?.convertToWorldSpaceAR(v3(0, 0, 0));
    }

    needScrollDown(rocket: Node, multiplier: number, animated: boolean) {
        this.handleMultiplier(multiplier);

        const convertRocketWorldPos = this.convertWorldPosition(rocket);
        const multiplierHeight = this.calcMultiplierHeight(multiplier);
        const multiplierBottomNode = this.nodeMultipliersContainer.getChildByName(`${this.multiplierBottom}`);
        const calcMultiplierPosY = this.convertWorldPosition(multiplierBottomNode)?.y + multiplierHeight;

        if (convertRocketWorldPos && calcMultiplierPosY > convertRocketWorldPos.y) {
            this.scrollDown(calcMultiplierPosY - convertRocketWorldPos.y, animated);
        }
    }
}
