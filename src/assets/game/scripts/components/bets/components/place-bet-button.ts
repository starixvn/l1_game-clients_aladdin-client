import { _decorator, Node, sp } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetHandler } from "../bet-handler";

const { ccclass, property } = _decorator;
const { handle } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Node)
    nodeAutoStart: Node = null;

    @property(sp.Skeleton)
    effect: sp.Skeleton = null;

    private isAutoStart = false;

    onLoad() {
        this.resetEffect();
        super.onLoad();
        this.addEvent();
    }

    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }

    resetEffect() {
        this.effect && this.effect.setAnimation(0, "idle", true);
    }

    @handle(BetHandler, (handler) => handler.handle())
    onBet() {
        this.unschedule(this.resetEffect);
        this.effect.setAnimation(0, "tap-anim", false);
        this.scheduleOnce(this.resetEffect, 1);
    }

    onClickBetButton() {
        if (!this.isAutoStart) {
            this.onBet();
            return;
        }
        this.isAutoStart = !this.isAutoStart;
    }

    addEvent() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    removeEvent() {
        this.node.off(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    eventOnEnter() {
        !this.isAutoStart && (document.body.style.cursor = "pointer");
    }

    eventOnLeave() {
        document.body.style.cursor = "default";
    }
}
