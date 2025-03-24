import { _decorator, Component } from "cc";
import { random } from "lodash-es";
import { CascadingSlotConfig } from "../../cascading-slot-base-configs";
import { CascadingSlotReel } from "../../slot-reel/scripts/cascading-slot-reel";
const { ccclass, property } = _decorator;

@ccclass
export class CascadingSlotBoard extends Component {
    protected readonly reels: CascadingSlotReel[] = [];

    public createReels() {
        if (this.reels.length > 0) {
            return;
        }
        this.node.children.forEach((child) => {
            const slotReel = child.getComponent(CascadingSlotReel);
            if (slotReel) {
                slotReel.itemDisplayCount = CascadingSlotConfig.reelItemCount;
                slotReel.createReel();
                this.reels.push(slotReel);
            }
        });
    }

    initBoardFullItems() {
        this.createReels();
        this.generateRandomItems();
    }

    generateRandomBoardData() {
        const samples = [
            [9, 1, 4, 2, 4, 8, 2, 0, 2, 2, 9, 5, 4, 10, 7, 0, 2, 7, 6, 6, 5, 8, 0, 3, 1, 5, 7, 3, 7, 7],
            [3, 4, 7, 7, 5, 2, 4, 5, 5, 3, 1, 10, 0, 9, 3, 7, 8, 3, 5, 7, 6, 6, 8, 7, 3, 0, 5, 0, 2, 7],
            [7, 5, 10, 2, 1, 7, 8, 9, 8, 8, 6, 8, 6, 4, 8, 5, 1, 0, 3, 6, 7, 9, 9, 0, 2, 0, 4, 6, 3, 1],
            [0, 1, 7, 3, 2, 1, 9, 5, 2, 8, 2, 7, 3, 7, 5, 10, 0, 0, 6, 4, 5, 4, 1, 8, 6, 4, 5, 3, 6, 9],
            [3, 6, 4, 0, 5, 2, 2, 2, 3, 7, 8, 4, 4, 3, 4, 9, 7, 4, 1, 10, 0, 1, 4, 2, 5, 9, 2, 1, 9, 0],
        ];
        const multipliers = [[3], [8], [12], [15], [18]];
        const randomIndex = random(samples.length - 1);
        console.log(`B${randomIndex}`);
        return { symbols: samples[randomIndex], multipliers: multipliers[randomIndex] };
    }

    protected generateRandomItems() {
        const data = this.generateRandomBoardData();
        const multipliers = data.multipliers;
        const symbols = data.symbols;
        this.reels.forEach((reel, index) => {
            const start = index * reel.itemDisplayCount;
            const end = start + reel.itemDisplayCount;
            const itemData = symbols.slice(start, end);
            reel.setItemData(itemData, multipliers);
        });
    }
}
