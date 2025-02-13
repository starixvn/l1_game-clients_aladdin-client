import gc from "@sg/game-client-base";
import { _decorator, EventTouch, Font, Intersection2D, Label, math, Node, PolygonCollider2D, sp } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AutoStartStore } from "../../auto-start/auto-start-store";
import { BalanceInfoHandler } from "../../balance/balance-info-handler";
import { BetHandler } from "../bet-handler";
import { BetStore, BetUIState } from "../bet-store";

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
    private tapAnimArea: Node = null;

    @property(sp.Skeleton)
    private effect: sp.Skeleton = null;
    @property([sp.Skeleton])
    private TapAnims: sp.Skeleton[] = [];

    @property([sp.Skeleton])
    private CrashAnims: sp.Skeleton[] = [];

    @property([Font])
    private fontMultipliers: Font[] = [];

    private isAutoStart = false;
    private isStart = false;
    private multiplier = 0;
    private currentTapAnim: sp.Skeleton = null;

    private readonly ANIMATION_DURATION = 0.5;
    private readonly EFFECT_RESET_DELAY = 1;
    private readonly MULTIPLIER_THRESHOLDS = {
        LEVEL_4: 110,
        LEVEL_3: 11,
        LEVEL_2: 1.2,
        LEVEL_1: 0,
    };

    private readonly MULTIPLIER_COLORS = {
        LEVEL_4: "#CE02C0",
        LEVEL_3: "#FFBE00",
        LEVEL_2: "#00B815",
        LEVEL_1: "#0C00BA",
    };

    onLoad() {
        this.initializeAnimations();
        super.onLoad();
        this.addEvent();
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
        this.TapAnims.forEach((anim) => (anim.node.active = false));
    }

    private deactivateAllCrashAnimations(): void {
        this.CrashAnims.forEach((anim) => (anim.node.active = false));
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

    @handle(BetHandler, (handler) => handler.changeStarted())
    onClickStartBet() {
        this.deactivateAllTapAnimations();
        this.showAxe();
    }

    @render(BetStore, (store) => store.isCrash)
    handleCrash(isCrash: boolean) {
        if (isCrash) {
            this.hideAxe();
            this.playCrashAnimation();
        }
    }

    showAxe() {
        if (this.currentTapAnim) {
            this.currentTapAnim.node.active = true;
        }
    }

    hideAxe() {
        if (this.currentTapAnim) {
            this.currentTapAnim.node.active = false;
        }
    }

    @handle(BetHandler, (handler) => handler.handleCashOut())
    onClickCashOut() {
        this.hideAxe();
    }

    @render(BetStore, (store) => store.multiplier)
    updateMultiplier(multiplier: number) {
        this.multiplier = multiplier;
        this.lblMultiplier.string = `${gc.FormatUtils.numberWithCommas(multiplier, 2, true)}x`;
        const level = this.getCurrentAnimationLevel(multiplier);
        this.updateTapAnim(level);
        this.updateMultiplierColor(level);
    }

    @render(BetStore, (store) => store.cashOutValue)
    updateCashOutValue(cashOutValue: number) {
        this.lblMoney.string = gc.FormatUtils.numberWithCommas(cashOutValue, 2, true);
    }

    @render(AutoStartStore, (store) => store.isAutoStart)
    updateIsAutoStart(isAutoStart: boolean) {
        this.isAutoStart = isAutoStart;
    }

    updateMultiplierColor(multiplier: number) {
        const level = this.getCurrentAnimationLevel(multiplier);
        this.lblMultiplier.font = this.fontMultipliers[level - 1];
    }

    updateTapAnim(level: number) {
        this.currentTapAnim = this.getTapAnim(level);

        this.deactivateAllTapAnimations();
        this.showAxe();
    }

    @render(BetStore, (store) => store.endBet)
    handleEndBet(endBet: number) {
        if (endBet > 0) {
            this.updateBalance();
        }
    }

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
        this.cashOutButton.on(Node.EventType.MOUSE_MOVE, this.eventOnEnter, this);
        this.cashOutButton.on(Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
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
            mousemove: this.eventOnEnter,
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
        const currentTapAnim = this.currentTapAnim;
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
        const events = ["mouseenter", "mouseleave", "touchstart", "mousemove", "mouseleave"];
        events.forEach((event) => {
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

    @render(BetStore, (store) => store.uiState)
    updateUIState(uiState: BetUIState) {
        console.log("uiState ", uiState);
        this.startBetButton.active = uiState === BetUIState.Start;
        this.cashOutButton.active = uiState === BetUIState.Bet || uiState === BetUIState.Mining;
        this.hitStoneButton.active = uiState === BetUIState.Started;
        this.lblMultiplier.node.active = uiState !== BetUIState.Start && uiState !== BetUIState.Started;

        this.isStart = uiState > BetUIState.Start;
    }
}
