import { _decorator, Node, Prefab } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";


const { ccclass, property } = _decorator;
@ccclass("room_container")
export class RoomContainer extends ObserverComponent {
    @property(Node)
    nodePlayers: Node = null;

    @property(Prefab)
    prfPlayer: Prefab = null;

    @property(Node)
    nodeMainPlayer: Node = null;

    onLoad() {
        super.onLoad();
        this.nodeMainPlayer.active = false;
    }
}
