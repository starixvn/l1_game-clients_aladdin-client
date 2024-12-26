import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { IWinner, LeaderBoardStore } from "../leader-board-store";
import { Winner } from "./winner";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
@ccclass("leader_board_container")
export class LeaderBoardContainer extends ObserverComponent {
    @property(Node)
    content: Node = null;

    @property(Prefab)
    prfWinner: Prefab = null;

    @render(LeaderBoardStore, (store) => store.winnersShowOnBoard)
    showWinners(winners: IWinner[]) {
        this.content.destroyAllChildren();
        winners.forEach((winner) => {
            const nodeWinner = instantiate(this.prfWinner);
            nodeWinner.getComponent(Winner).setData(winner);
            this.content.addChild(nodeWinner);
        });
    }
}
