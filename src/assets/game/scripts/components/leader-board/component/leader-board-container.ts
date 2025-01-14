import { _decorator, Node, Prefab } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";


const { ccclass, property } = _decorator;
@ccclass("leader_board_container")
export class LeaderBoardContainer extends ObserverComponent {
    @property(Node)
    nodeWinners: Node = null;

    @property(Prefab)
    prfWinner: Prefab = null;

    @property(Node)
    nodeMainPlayer: Node = null;

    onLoad() {
        super.onLoad();
        this.nodeMainPlayer.active = false;
    }
}
