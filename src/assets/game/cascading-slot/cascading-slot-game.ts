import { _decorator, sp } from "cc";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { CascadingSlotConfig } from "./cascading-slot-base-configs";
import { prefabCache } from "./cascading-slot-utils";
const { ccclass, property } = _decorator;

@ccclass("cascading_slot_game")
export class CascadingSlotGame extends ObserverComponent {
    async loadSlotSymbols() {
        const cache = prefabCache.slotSymbols || {};
        for (let index = 0; index < CascadingSlotConfig?.symbolCount; index++) {
            if (cache[index]) {
                continue;
            }
            const path = `preload/symbol-spines/symbol-${index}`;
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
}
