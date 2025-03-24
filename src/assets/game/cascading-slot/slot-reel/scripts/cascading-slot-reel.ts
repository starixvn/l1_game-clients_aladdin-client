import { _decorator, Component, instantiate, Node, Prefab, v3 } from "cc";
import { CascadingSlotConfig } from "../../cascading-slot-base-configs";
import { CascadingSlotReelItem } from "./cascading-slot-reel-item";
const { ccclass, property } = _decorator;

@ccclass
export class CascadingSlotReel extends Component {
    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    effectContainer: Node = null;

    @property
    spacing = 15;

    @property
    itemSize = 145;

    itemDisplayCount = CascadingSlotConfig.reelItemCount;
    protected items: CascadingSlotReelItem[] = [];
    public readonly pixelPerSecond = 145 * 15;

    createReel() {
        for (let i = 0; i < this.itemDisplayCount; i++) {
            const item = this.addItem();
            item.node.position = v3(item.node.position.x, this.getItemPosY(i), 0);
        }
    }

    getItems() {
        return this.items;
    }

    getItemPosY(index: number) {
        const start = this.spacing + this.itemSize * 0.5;
        return start + index * (this.spacing + this.itemSize);
    }

    addItem() {
        const node = this.createReelItem();
        const item = node.getComponent(CascadingSlotReelItem);
        //item.gameId = this.gameId;
        this.items.push(item);
        return item;
    }

    createReelItem(): Node {
        const node = instantiate(this.itemPrefab);
        this.node.addChild(node);
        return node;
    }

    getItemNode(index: number): Node {
        const item = this.items[index];
        return item.node;
    }

    addItems(data: number[]): CascadingSlotReelItem[] {
        let i = 0;
        const items = [];
        data.forEach((value) => {
            if (value === -1) {
                return;
            }
            const item = this.addItem();
            item.setItem(value);
            items.push(item);
            item.node.position = v3(item.node.position.x, this.getItemPosY(this.itemDisplayCount + i), 0);
            i++;
        });
        return items;
    }

    setItemData(data: number[], multiplier: number[]) {
        this.items.forEach((item, index) => {
            item.setItem(data[index]);
        });

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.updateMultiplierItem(multiplier);
        }
    }
}
