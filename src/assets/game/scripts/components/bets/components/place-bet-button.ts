import { _decorator, EventTouch, Intersection2D, math, Node, PolygonCollider2D, sp, UITransform, v3, Vec2 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetHandler } from "../bet-handler";
import { AutoStartHandler } from "../../auto-start/auto-start-handler";
import { BetStore } from "../bet-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Node)
    cashOutButton: Node = null;

    @property(Node)
    startBetButton: Node = null;

    @property(Node)
    tapArea: Node = null;

    @property(sp.Skeleton)
    tapAnim: sp.Skeleton = null;

    @property(sp.Skeleton)
    effect: sp.Skeleton = null;

    private isAutoStart = false;
    private isStart = false;

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
        this.effect && this.effect.setAnimation(0, "levitation", true);
    }

    @handle(BetHandler, (handler) => handler.handle())
    onBet() {
        if(this.isStart) {
            this.unschedule(this.resetEffect);
            this.effect.setAnimation(0, "tap_3", false);
            this.scheduleOnce(this.resetEffect, 1);
        }
    }

    @handle(BetHandler, (handler) => handler.resetBetCount())
    onClickStartBet(){
        this.updateStatusStart(true);
        this.tapAnim.node.active = true;
        this.cashOutButton.active = true;
        this.startBetButton.active = false;
    }

    onClickCashOut(){
        this.updateStatusStart(false);
        this.tapAnim.node.active = false;
        this.cashOutButton.active = false;
        this.startBetButton.active = true;
    }


    @handle(BetHandler, (handler, isStart: boolean) => handler.updateStatusStart(isStart))
    updateStatusStart(isStart: boolean) {
        this.isStart = isStart;
        return isStart;
    }

    @render(BetStore, (store) => store.isStart)
    setVisibilityRoundsAutoplay(isStart: boolean) {
        this.isStart = isStart;
    }

    onClickBetButton() {
        if (!this.isAutoStart) {
            this.onBet();
        }
    }

    addEvent() {
        this.node.on(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
        this.tapArea.on(Node.EventType.TOUCH_START, this.onTap, this);
        this.tapArea.on(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.tapArea.on(Node.EventType.MOUSE_MOVE, this.eventOnEnter, this);
        this.tapArea.on(Node.EventType.MOUSE_LEAVE, this.resetCursor, this);
    }

    onTap(event) {
        if (this.touchInPolygon(event) && this.isStart) {
            // this.handleBet(false);
            this.playTapAnimation(new Vec2(815, 685));
        }
    }

    protected touchInPolygon(event: EventTouch) {
        const location = event.getUILocation();
        const polygon = this.tapArea.getComponent(PolygonCollider2D).worldPoints;
        return Intersection2D.pointInPolygon(math.v2(location.x, location.y), polygon);
    }

    playTapAnimation(location: Vec2) {
        this.tapAnim.node.position = this.tapAnim.node.parent.getComponent(UITransform).convertToNodeSpaceAR(v3(location.x, location.y, 0));
        this.tapAnim.setAnimation(0, "kick_3", false);
        this.effect.setAnimation(0, "tap_3", false);
    }

    // handleBet(byButton: boolean) {
    //     if (!this.isAutoStart) {
    //         byButton && this.playEffectBetButton();
    //         this.onBet();
    //         return;
    //     }

    //     this.cancelAutoStart();
    // }

    
    @handle(AutoStartHandler, (handle) => handle.handleAutoStart())
    cancelAutoStart() {}

    playEffectBetButton() {
        this.effect.setAnimation(0, "tap_3", false);
    }

    resetCursor() {
        document.body.style.cursor = "default";
    }

    removeEvent() {
        this.node.off(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
        if (this.tapArea && this.tapArea.isValid) {
            this.tapArea.off(Node.EventType.TOUCH_START, this.onTap, this);
            this.tapArea.off(Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
            this.tapArea.off(Node.EventType.MOUSE_MOVE, this.eventOnEnter, this);
            this.tapArea.off(Node.EventType.MOUSE_LEAVE, this.resetCursor, this);
        }
    }

    eventOnEnter() {
        !this.isAutoStart && (document.body.style.cursor = "pointer");
    }

    eventOnLeave() {
        document.body.style.cursor = "default";
    }
}
