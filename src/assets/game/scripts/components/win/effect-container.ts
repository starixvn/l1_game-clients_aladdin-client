import { _decorator, Node, Prefab, sp } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { IPlayer, RoomStore } from "../room/room-store";
const { ccclass, property } = _decorator;
const { render } = Observer;

@ccclass("EffectContainer")
export class EffectContainer extends ObserverComponent {
    @property(sp.Skeleton)
    spineRock: sp.Skeleton = null;

    @property(Prefab)
    prfOtherWinNotice: Prefab = null;

    @property(Prefab)
    prfMainPlayerNotice: Prefab = null;

    @property(Node)
    areaNode: Node = null;

    @property(Node)
    balanceNode: Node = null;

    @property(Node)
    multiplierNode: Node = null;

    container: Node = null;

    onLoad() {
        this.container = this.node.getChildByName("notice-container");
        super.onLoad();
    }

    @render(RoomStore, (store) => store.player, { fireImmediately: false })
    showPlayers(player: IPlayer) {
    }

    showMainPlayerWinning(data: { betWin: number; bigWin: boolean }) {
    }
}
