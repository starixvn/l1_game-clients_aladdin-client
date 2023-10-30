import gc from "@sg/game-client-base";
import { Label, Node, Prefab, Sprite, _decorator, instantiate } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { StatisticsButton } from "./statistics-button";
const { ccclass, property } = _decorator;
const { render } = Observer;

export interface CrashRoundHistory extends gc.RoundHistories.RoundHistory {
    md5Result: any;
}

@ccclass
export class StatisticsBar extends ObserverComponent {
    @property(Prefab)
    prbStatisticsItem: Prefab = null;

    @property(Node)
    content: Node = null;

    @property(Label)
    lblValueCurrentRound: Label = null;

    @property(Sprite)
    sprCurrentRound: Sprite = null;

    protected rounds: CrashRoundHistory[] = [];

    @render(gc.RoundHistories.RoundHistoryStore, (store) => store.histories)
    setRoundsInfo(rounds: CrashRoundHistory[]) {
        this.rounds = [...rounds];
        this.updateStatisticsBarInfo(this.rounds);
    }

    private updateStatisticsBarInfo(rounds: CrashRoundHistory[]) {
        if (this.rounds.length === 0) {
            return;
        }
        this.content.destroyAllChildren();

        rounds.forEach((round, index) => {
            if (index < 1) {
                return;
            }
            const node = instantiate(this.prbStatisticsItem);
            const control = node.getComponent(StatisticsButton);
            control.setData(round);
            this.content.addChild(node);
        });
    }
}
