import gc from "@sg/game-client-base";
import { _decorator, Sprite } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AutoPlayHandler } from "../auto-play-handler";
import { AutoPlayStore } from "../auto-play-store";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class AutoPlayButton extends ObserverComponent {
    @property(Sprite)
    sprIconAutoPlay: Sprite = null;

    @property(Sprite)
    sprIconPause: Sprite = null;

    @handle(AutoPlayHandler, (handle) => handle.clickAutoPlay())
    onClickAutoPlay() {}

    @render(AutoPlayStore, (store) => store.isAutoplay)
    updateAutoPlayButton(isAutoPlay: boolean) {
        this.sprIconAutoPlay.node.active = !isAutoPlay;
        this.sprIconPause.node.active = isAutoPlay;
    }
}
