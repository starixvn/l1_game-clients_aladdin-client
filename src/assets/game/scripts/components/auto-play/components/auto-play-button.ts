import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AutoPlayHandler } from "../auto-play-handler";
import { AutoPlayStore } from "../auto-play-store";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class AutoPlayButton extends ObserverComponent {
    @property(Label)
    lblNoOfRound: Label = null;

    @property(Sprite)
    sprIconAutoPlay: Sprite = null;

    @handle(AutoPlayHandler, (handle) => handle.clickAutoPlay())
    onClickAutoPlay() {}

    @render(AutoPlayStore, (store) => store.roundsAutoPlay)
    setNoOfRound(roundsAutoPlay: number) {
        this.lblNoOfRound.string = roundsAutoPlay.toString();
    }

    @render(AutoPlayStore, (store) => store.isAutoPlay)
    updateAutoPlayButton(isAutoPlay: boolean) {
        this.lblNoOfRound.node.active = isAutoPlay;
        this.sprIconAutoPlay.node.active = !isAutoPlay;
    }
}
