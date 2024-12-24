import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AutoPlayStore } from "../../auto-play/auto-play-store";
import { BetHandler } from "../bet-handler";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Node)
    nodeRoundsAutoPlay: Node = null;

    @handle(BetHandler, (handler) => handler.handle())
    onBet() {}

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    setVisibilityRoundsAutoplay(isAutoPlay: boolean) {
        this.nodeRoundsAutoPlay && (this.nodeRoundsAutoPlay.active = isAutoPlay);
    }

    @render(AutoPlayStore, (store) => store.roundsAutoPlay)
    setNoOfRound(roundsAutoPlay: number) {
        this.nodeRoundsAutoPlay && (this.nodeRoundsAutoPlay.getComponent(Label).string = roundsAutoPlay.toString());
    }
}
