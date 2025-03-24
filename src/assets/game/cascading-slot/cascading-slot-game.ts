import { _decorator, Prefab, sp } from "cc";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { CascadingSlotConfig } from "./cascading-slot-base-configs";
import { prefabCache } from "./cascading-slot-utils";
import { CascadingSlotBoard } from "./slot-board/components/cascading-slot-board";
const { ccclass, property } = _decorator;

@ccclass("cascading_slot_game")
export class CascadingSlotGame extends ObserverComponent {
    @property(CascadingSlotBoard)
    board: CascadingSlotBoard = null;

    onLoad() {
        super.onLoad();
        this.loadSlotSymbols().then(async () => {
            await this.loadMultiplierPrefab();
            this.board.initBoardFullItems();
        });
        console.log(prefabCache);
    }

    async loadSlotSymbols() {
        const cache = prefabCache.slotSymbols || {};
        for (let index = 0; index < CascadingSlotConfig?.symbolCount; index++) {
            if (cache[index]) {
                continue;
            }
            const path = `symbol-spines/symbol-${index}`;
            //const devPath = `../games/*/${path}`;
            try {
                const data = await bundleManager.loadAssetsFromBundle<sp.SkeletonData>("resources", path, sp.SkeletonData, null);
                // const data = await BundleManager.getInstance().loadAsset<sp.SkeletonData>({
                //     bundleId: this.gameId.toString(),
                //     path: path,
                //     pathForDevMode: devPath,
                //     type: sp.SkeletonData
                // });

                cache[index] = data;
            } catch (error) {
                console.warn(`Missing SkeletonData for ${path} `, error);
            }
        }

        prefabCache.slotSymbols = cache;
    }

    async loadMultiplierPrefab() {
        const cache = prefabCache.multiplierPrefab || {};
        if (cache !== null) {
            const path = `prefabs/multiplier`;
            try {
                const prefab = await bundleManager.loadAssetsFromBundle<Prefab>("resources", path, Prefab, null);

                prefabCache.multiplierPrefab = prefab;
            } catch (e) {
                console.warn(`Missing prefab for ${path} `, e);
            }
        }
    }
}
