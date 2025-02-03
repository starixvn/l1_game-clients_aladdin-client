import { _decorator, EventTouch, Intersection2D, Label, math, Node, PolygonCollider2D, sp, UITransform, v3, Vec2 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetHandler } from "../bet-handler";
import { AutoStartHandler } from "../../auto-start/auto-start-handler";
import { BetStore } from "../bet-store";
import { BalanceInfoHandler } from "../../balance/balance-info-handler";
import { CashOutHistoryHandlers } from "../../cash-out-history/cash-out-history-handlers";
import { inject } from "inversify";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Node)
    cashOutButton: Node = null;

    @property(Node)
    startBetButton: Node = null;
    
    @property(Label)
    lblMultiplier: Label = null;

    @property(Node)
    tapArea: Node = null;
    
    @property(sp.Skeleton)
    crashAnim: sp.Skeleton = null;

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
        this.isStart = false;
        this.isAutoStart = false;
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
        this.unschedule(this.resetEffect);
        this.effect.setAnimation(0, "tap_3", false);
        this.scheduleOnce(this.resetEffect, 1);
    }

    @handle(BetHandler, (handler) => handler.resetBet())
    onClickStartBet(){
        this.updateStatusStart(true);
        this.tapAnim.node.active = true;
        this.cashOutButton.active = true;
        this.startBetButton.active = false;
        this.lblMultiplier.node.active = true;
    }

    @render(BetStore, (store) => store.isCrash)
    handleCrash(isCrash: boolean){
        if(isCrash){
            this.updateStatusStart(false);
            this.tapAnim.node.active = false;
            this.cashOutButton.active = false;
            this.startBetButton.active = true;
            this.lblMultiplier.node.active = false;
            this.playCrashAnimation(new Vec2(815, 685));
        }
    }

    @handle(BetHandler, (handler) => handler.handleCashOut())
    onClickCashOut(){
        this.tapAnim.node.active = false;
        this.cashOutButton.active = false;
        this.startBetButton.active = true;
        this.lblMultiplier.node.active = false;
        this.updateStatusStart(false);
        this.addCashOutHistory();
    }


    @handle(BetHandler, (handler, isStart: boolean) => handler.updateStatusStart(isStart))
    updateStatusStart(isStart: boolean) {
        this.isStart = isStart;
        return isStart;
    }

    @render(BetStore, (store) => store.multiplier)
    updateMultiplier(multiplier: number) {
        this.lblMultiplier.string = multiplier.toString();
    }

    @render(BetStore, (store) => store.endBet)
    handleEndBet(endBet: number) {
        if(endBet > 0){
            this.updateBalance();
        }
    }

    @render(BetStore, (store) => store.win)
    handleWin(win: boolean) {
        if(win) {
            this.updateBalance();
        } 
    }

    @handle(CashOutHistoryHandlers, (handler) => handler.addCashOutHistory())
    addCashOutHistory(){}

    @handle(BalanceInfoHandler, (handler) => handler.updateBalance())
    updateBalance() {}

    onClickBetButton() {
        if (this.isStart) {
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

    playCrashAnimation(location: Vec2){
        this.crashAnim.node.active = true;
        this.crashAnim.node.position = this.crashAnim.node.parent.getComponent(UITransform).convertToNodeSpaceAR(v3(location.x, location.y, 0));
        this.crashAnim.setAnimation(0, "pickaxe_crash_2", false);
        this.scheduleOnce(() => {
            this.crashAnim.node.active = false;
        }, 0.5);
    }

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
