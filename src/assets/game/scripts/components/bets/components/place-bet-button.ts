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
    nodeAutoPlay: Node = null;

    @property(Label)
    lblRoundsAutoPlay: Label = null;

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
        this.nodeAutoPlay && (this.nodeAutoPlay.active = isAutoPlay);
        this.isAutoplay = isAutoPlay;
    }

    @render(AutoPlayStore, (store) => store.roundsAutoplay)
    setNoOfRound(roundsAutoPlay: number) {
        this.nodeAutoPlay && (this.lblRoundsAutoPlay.string = roundsAutoPlay.toString());
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
        this.node.on(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    removeEvent() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.node.off(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    onKeyDown(event) {
        const { keyCode } = event;
        if (keyCode === KeyCode.SPACE) {
            this.updatePressingKey(true);
        }
    }

    eventOnEnter() {
        !this.isAutoplay && (document.body.style.cursor = "pointer");
    }

    eventOnLeave() {
        document.body.style.cursor = "default";
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
