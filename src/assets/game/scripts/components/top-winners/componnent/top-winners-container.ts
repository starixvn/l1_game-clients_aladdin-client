import gc from "@sg/game-client-base";
import { _decorator, instantiate, Node, Prefab, tween, v3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { TopWinner, TopWinnersStore } from "../top-winners-store";
import { TopWinnerItem } from "./top-winner-item";
const { ccclass, property } = _decorator;

const { Rounds, Player } = gc;
const { render, handle } = Observer;
const { MainPlayerStore } = Player;

@ccclass
export class TopWinnersContainer extends ObserverComponent {
    @property(Node)
    container: Node = null;

    @property(Prefab)
    topWinnerPrefab: Prefab = null;

    @property
    itemSize = 50;
    @property
    padding = 5;

    playerName: string = "";

    @render(TopWinnersStore, (store) => store.winners)
    renderWinners(winners: TopWinner[]) {
        winners.forEach((winner) => {
            this.addItem(winner);
        });
    }

    @render(gc.Player.MainPlayerStore, (store) => store.name)
    renderPlayerName(name: string) {
        this.playerName = name;
    }

    private addItem(winner: TopWinner) {
        const winnerNode = instantiate(this.topWinnerPrefab);
        const count = this.container.children.length;
        const topWinnerItem = winnerNode.getComponent(TopWinnerItem);
        const isMainPlayer = winner.name === this.playerName;

        topWinnerItem.setData(winner, isMainPlayer);
        this.container.addChild(winnerNode);
        winnerNode.setPosition(0, -count * this.itemSize + (count - 1) * this.padding, 0);
    }

    @render(TopWinnersStore, (store) => store.newTopWinner)
    renderNewTopWinner(newTopWinner: TopWinner) {
        this.addItem(newTopWinner);
        this.movingUp();
    }

    movingUp() {
        const children = this.container.children;
        const noMoving = children.length <= 10;

        if (noMoving) {
            return;
        }

        children.forEach((child, index) => {
            const oldest = index === 0;
            if (oldest) {
                AnimationUtils.fadeOut(child, 0.5).then(() => {
                    child.destroy();
                });
            } else {
                const isNew = index === children.length - 1;
                if (isNew) {
                    AnimationUtils.setOpacityNode(child, 1);
                    AnimationUtils.fadeIn(child, 0.5);
                }
            }

            tween(child)
                .by(0.5, { position: v3(0, this.itemSize, 0) })
                .start();
        });
    }
}
