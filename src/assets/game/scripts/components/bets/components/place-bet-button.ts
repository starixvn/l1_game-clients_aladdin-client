import gc from "@sg/game-client-base";
import { _decorator, Input, input, KeyCode, Label, macro, Node } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AutoPlayHandler } from "../../auto-play/auto-play-handler";
import { AutoPlayStore } from "../../auto-play/auto-play-store";
import { BetHandler } from "../bet-handler";
import { HoldActionStore } from "../hold-action-store";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Node)
    nodeRoundsAutoPlay: Node = null;
    private isAutoplay = false;

    onLoad() {
        super.onLoad();
        this.addEvent();
    }

    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }

    @handle(BetHandler, (handler) => handler.handle())
    onBet() {}

    @render(AutoPlayStore, (store) => store.isAutoplay)
    setVisibilityRoundsAutoplay(isAutoPlay: boolean) {
        this.nodeRoundsAutoPlay && (this.nodeRoundsAutoPlay.active = isAutoPlay);
        this.isAutoplay = isAutoPlay;
    }

    @render(AutoPlayStore, (store) => store.roundsAutoplay)
    setNoOfRound(roundsAutoPlay: number) {
        this.nodeRoundsAutoPlay && (this.nodeRoundsAutoPlay.getComponent(Label).string = roundsAutoPlay.toString());
    }

    onClickBetButton() {
        if (!this.isAutoplay) {
            this.onBet();
            return;
        }
        this.isAutoplay = !this.isAutoplay;
        !this.isAutoplay && this.cancelAutoPlay();
    }

    @handle(AutoPlayHandler, (handle) => handle.cancelAutoPlay())
    cancelAutoPlay() {}

    addEvent() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    removeEvent() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        const { keyCode } = event;
        if (keyCode === KeyCode.SPACE) {
            this.updatePressingKey(true);
        }
    }

    onKeyUp(event) {
        const { keyCode } = event;
        if (keyCode === KeyCode.SPACE) {
            this.updatePressingKey(false);
        }
    }

    @handle(BetHandler, (handler, isPressingKey: boolean) => handler.updatePressingKey(isPressingKey))
    updatePressingKey(isPressingKey: boolean) {
        return isPressingKey;
    }

    @render(HoldActionStore, (store) => store.isPressingKey, { fireImmediately: false })
    handleAutoBet(isPressingKey: boolean) {
        if (!isPressingKey) {
            this.unschedule(this.onBet);
            return;
        }
        this.schedule(this.onBet, 2, macro.REPEAT_FOREVER);
    }
}
