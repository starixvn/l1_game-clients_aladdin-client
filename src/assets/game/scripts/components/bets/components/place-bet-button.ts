import { _decorator, Color, EventTouch, Intersection2D, Label, math, Node, PolygonCollider2D, sp, UITransform, v3, Vec2 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetHandler } from "../bet-handler";
import { AutoStartHandler } from "../../auto-start/auto-start-handler";
import { BetStore } from "../bet-store";
import { BalanceInfoHandler } from "../../balance/balance-info-handler";
import { CashOutHistoryHandlers } from "../../cash-out-history/cash-out-history-handlers";
import { inject } from "inversify";
import { AutoStartStore } from "../../auto-start/auto-start-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @property(Node)
    private cashOutButton: Node = null;

    @property(Node)
    private startBetButton: Node = null;

    @property(Node)
    private hitStoneButton: Node = null;
    
    @property(Label)
    private lblMultiplier: Label = null;

    @property(Label)
    private lblMoney: Label = null;

    @property(Node)
    private tapArea: Node = null;
    
    @property(Node)
    tapAnimArea: Node = null;

    @property(sp.Skeleton)
    private effect: sp.Skeleton = null;
    @property([sp.Skeleton])
    private TapAnims: sp.Skeleton[] = [];

    @property([sp.Skeleton])
    private CrashAnims: sp.Skeleton[] = [];

    private isAutoStart = false;
    private isStart = false;
    private multiplier = 0;
    private balance = 0;
    private endBet = 0;

    private readonly ANIMATION_DURATION = 0.5;
    private readonly EFFECT_RESET_DELAY = 1;
    private readonly MULTIPLIER_THRESHOLDS = {
        LEVEL_4: 110,
        LEVEL_3: 11,
        LEVEL_2: 1.2,
        LEVEL_1: 0
    };

    private readonly MULTIPLIER_COLORS = {
        LEVEL_4: "#CE02C0",
        LEVEL_3: "#FFBE00",
        LEVEL_2: "#00B815",
        LEVEL_1: "#0C00BA"
    };

    onLoad() {
        this.initializeAnimations();
        super.onLoad();
        this.addEvent();
        this.isStart = false;
        this.isAutoStart = false;
    }

    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }

    private initializeAnimations(): void {
        this.deactivateAllTapAnimations();
        this.deactivateAllCrashAnimations();
        this.resetEffect();
    }

    private deactivateAllTapAnimations(): void {
        this.TapAnims.forEach(anim => anim.node.active = false);
    }

    private deactivateAllCrashAnimations(): void {
        this.CrashAnims.forEach(anim => anim.node.active = false);
    }

    resetEffect() {
        this.effect && this.effect.setAnimation(0, "levitation", true);
    }

    @handle(BetHandler, (handler) => handler.handle())
    onBet() {
        this.unschedule(this.resetEffect);
        this.effect.setAnimation(0, "tap_3", false);
        this.scheduleOnce(this.resetEffect, this.EFFECT_RESET_DELAY);
    }

    @handle(BetHandler, (handler) => handler.resetBet())
    onClickStartBet() {
        if(this.balance > 0){
            this.updateStatusStart(true);
            const level = this.getCurrentAnimationLevel(this.multiplier);
            
            this.deactivateAllTapAnimations();
            this.getTapAnim(level).node.active = true;
            
            this.updateUIForBetStart();
        }
    }

    @render(BetStore, (store) => store.isCrash)
    handleCrash(isCrash: boolean){
        if(isCrash){
            this.updateStatusStart(false);
            const level = this.getCurrentAnimationLevel(this.multiplier);
            const currentTapAnim = this.getTapAnim(level);
            
            currentTapAnim.node.active = false;
            
            this.playCrashAnimation();
            this.updateUIForBetEnd();
        }
    }

    @handle(BetHandler, (handler) => handler.handleCashOut())
    onClickCashOut(){
        const level = this.getCurrentAnimationLevel(this.multiplier);
        const currentTapAnim = this.getTapAnim(level);
        
        currentTapAnim.node.active = false;
        
        this.updateStatusStart(false);
        this.addCashOutHistory();
        this.updateUIForBetEnd();
    }

    @handle(BetHandler, (handler, isStart: boolean) => handler.updateStatusStart(isStart))
    updateStatusStart(isStart: boolean) {
        this.isStart = isStart;
        return isStart;
    }

    @render(BetStore, (store) => store.multiplier)
    updateMultiplier(multiplier: number) {
        const formattedMultiplier = multiplier === 0 ? "1.00" : multiplier.toString();
        this.lblMultiplier.string = `${formattedMultiplier}x`;
        multiplier !== 0 && (this.multiplier = multiplier);
        multiplier > 0 && this.updateUIForCashOut();
        this.lblMoney.string = (multiplier * this.endBet).toString();
        this.checkTapAnim();
        this.updateMultiplierColor();
    }

    @render(BalanceInfoHandler, (store) => store.balance)
    setBalance(balance: number) {
        this.balance = balance;
    }

    @render(AutoStartStore, (store) => store.isAutoStart)
    updateIsAutoStart(isAutoStart: boolean) {
        this.isAutoStart = isAutoStart;
    }

    updateMultiplierColor(){
        const level = this.getCurrentAnimationLevel(this.multiplier);
        this.lblMultiplier.color = new Color(this.MULTIPLIER_COLORS[`LEVEL_${level}`]);
    }

    checkTapAnim(){
        const level = this.getCurrentAnimationLevel(this.multiplier);
        const currentTapAnim = this.getTapAnim(level);
        this.deactivateAllTapAnimations();
        currentTapAnim.node.active = true;
    }

    @render(BetStore, (store) => store.endBet)
    handleEndBet(endBet: number) {
        if(endBet > 0){
            this.endBet = endBet;
            this.updateBalance();
        } 
    }

    @render(BetStore, (store) => store.win)
    handleWin(win: boolean) {
        win && this.updateBalance();
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

    private getEventHandler(event: string): Function {
        const handlers = {
            mouseenter: this.eventOnEnter,
            mouseleave: this.eventOnLeave,
            touchstart: this.onTap,
            mousemove: this.eventOnEnter
        };
        return handlers[event] || this.resetCursor;
    }

    onTap(event) {
        if (this.touchInPolygon(event) && this.isStart) {
            this.playTapAnimation();
        }
    }

    protected touchInPolygon(event: EventTouch) {
        const location = event.getUILocation();
        const polygon = this.tapArea.getComponent(PolygonCollider2D).worldPoints;
        return Intersection2D.pointInPolygon(math.v2(location.x, location.y), polygon);
    }

    private getCurrentAnimationLevel(multiplier: number): number {
        const { LEVEL_4, LEVEL_3, LEVEL_2 } = this.MULTIPLIER_THRESHOLDS;
        if (multiplier >= LEVEL_4) return 4;
        if (multiplier >= LEVEL_3) return 3;
        if (multiplier >= LEVEL_2) return 2;
        return 1;
    }

    private getTapAnim(level: number): sp.Skeleton {
        return this.TapAnims[level - 1] || this.TapAnims[0];
    }

    private getCrashAnim(level: number): sp.Skeleton {
        return this.CrashAnims[level - 1] || this.CrashAnims[0];
    }

    playTapAnimation() {
        const level = this.getCurrentAnimationLevel(this.multiplier);
        const currentTapAnim = this.getTapAnim(level);
        
        currentTapAnim.node.position = this.tapAnimArea.getPosition();
        currentTapAnim.setAnimation(0, `kick_3`, false);
        this.effect.setAnimation(0, `tap_3`, false);
    }

    playCrashAnimation() {
        const level = this.getCurrentAnimationLevel(this.multiplier);
        const currentCrashAnim = this.getCrashAnim(level);
        
        currentCrashAnim.node.active = true;
        currentCrashAnim.node.position = this.tapAnimArea.getPosition();
        currentCrashAnim.setAnimation(0, `pickaxe_crash_2`, false);
        this.scheduleOnce(() => {
            currentCrashAnim.node.active = false;
        }, this.ANIMATION_DURATION);
    }

    playEffectBetButton() {
        this.effect.setAnimation(0, "tap_3", false);
    }

    resetCursor() {
        document.body.style.cursor = "default";
    }

    removeEvent() {
        const events = ['mouseenter', 'mouseleave', 'touchstart', 'mousemove', 'mouseleave'];
        events.forEach(event => {
            const handler = this.getEventHandler(event);
            this.node.off(`Node.EventType.${event.toUpperCase()}`, handler, this);
        });
    }

    eventOnEnter() {
        document.body.style.cursor = "pointer";
    }

    eventOnLeave() {
        document.body.style.cursor = "default";
    }

    private updateUIForBetEnd() {
        this.cashOutButton.active = false;
        this.startBetButton.active = true;
        this.lblMultiplier.node.active = false;
        this.hitStoneButton.active = false;
        this.multiplier = 0;
        this.isAutoStart && this.onClickStartBet();
    }

    private updateUIForCashOut() {
        this.cashOutButton.active = true;
        this.startBetButton.active = false;
        this.hitStoneButton.active = false;
        this.lblMultiplier.node.active = true;
    }

    private updateUIForBetStart() {
        this.cashOutButton.active = false;
        this.startBetButton.active = false;
        this.lblMultiplier.node.active = true;
        this.hitStoneButton.active = true;
    }
}
