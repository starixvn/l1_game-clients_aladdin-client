import gc from "@sg/game-client-base";
import {
    _decorator,
    Animation,
    Button,
    EventTouch,
    Font,
    Intersection2D,
    Label,
    math,
    Node,
    ParticleSystem2D,
    PolygonCollider2D,
    sp,
    v3,
} from "cc";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-magager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
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

    @property(sp.Skeleton)
    private effect: sp.Skeleton = null;

    @property(sp.Skeleton)
    private spineAxe: sp.Skeleton = null;

    @property([Font])
    private fontMultipliers: Font[] = [];

    @property(Font)
    private activeMoneyFont: Font = null;

    @property(Font)
    private disableMoneyFont: Font = null;

    @property(ParticleSystem2D)
    private levelUpParticle: ParticleSystem2D = null;

    private canBet = false;
    private multiplier = 0;
    private axeLevel = 1;
    private currentAnimationName = "";

    private readonly EFFECT_RESET_DELAY = 1;
    private readonly MULTIPLIER_THRESHOLDS = {
        LEVEL_4: 110,
        LEVEL_3: 11,
        LEVEL_2: 1.2,
        LEVEL_1: 0,
    };

    onLoad() {
        this.initializeAnimations();
        super.onLoad();
        this.addEvent();
    }

    onDestroy(): void {
        super.onDestroy();
        this.removeEvent();
    }

    private initializeAnimations(): void {
        this.hideAxe();
        this.resetEffect();
    }

    resetEffect() {
        this.effect && this.effect.setAnimation(0, "levitation", true);
    }

    @handle(BetHandler, (handler) => handler.handle())
    onBet() {
        this.unschedule(this.resetEffect);
        this.scheduleOnce(this.resetEffect, this.EFFECT_RESET_DELAY);
    }

    @handle(BetHandler, (handler) => handler.changeStarted())
    onClickStartBet() {
        this.showAxe();
    }

    @render(BetStore, (store) => store.settleStatus, { fireImmediately: false })
    handleCrash(settleStatus: any) {
        if (settleStatus) {
            !settleStatus.win && this.playCrashAnimation();
        } else {
            this.hideAxe();
        }
    }

    showAxe() {
        console.log("showAxe");
        if (this.spineAxe) {
            this.spineAxe.node.active = true;
        }
    }

    hideAxe() {
        console.log("hideAxe");
        if (this.spineAxe) {
            this.spineAxe.node.active = false;
        }
    }

    @handle(BetHandler, (handler) => handler.handleCashOut())
    onClickCashOut() {
        this.hideAxe();
    }

    @render(BetStore, (store) => store.multiplier)
    async updateMultiplier(multiplier: number) {
        try {
            this.multiplier = multiplier;
            this.lblMultiplier.string = `${gc.FormatUtils.numberWithCommas(multiplier, 2, false)}x`;
            const level = this.getCurrentAnimationLevel(multiplier);
            if (this.axeLevel < level) {
                await this.playAxeTransformation(level);
            }
            this.axeLevel = level;
            await this.updateTapAnim(level);

            const needPlayTapAnimation = this.multiplier > 1.0;
            if (needPlayTapAnimation) {
                this.playTapAnimation();
            }
            this.updateMultiplierColor(level);
        } catch (e) {}
    }

    async playAxeTransformation(level: number) {
        try {
            const spineInfo = this.getTransformSpineInfo(level);
            const skeletonData = await this.loadAxeSpine(spineInfo.name);
            this.spineAxe.skeletonData = skeletonData;
            await AnimationUtils.playSpine(this.spineAxe, spineInfo.animation, false);
            this.playLevelUpParticle();
        } catch (e) {}
    }

    playLevelUpParticle() {
        this.levelUpParticle.resetSystem();
    }

    @render(BetStore, (store) => store.winAmount)
    updateCashOutValue(cashOutValue: number) {
        this.lblMoney.string = gc.FormatUtils.numberWithCommas(cashOutValue, 2, true);
    }

    updateMultiplierColor(level: number) {
        this.lblMultiplier.font = this.fontMultipliers[level - 1];
    }

    async updateTapAnim(level: number) {
        this.spineAxe = this.spineAxe;
        try {
            const kickSpineInfo = this.getKickSpineInfo(level);
            this.currentAnimationName = kickSpineInfo.animation;
            const skeletonData = await this.loadAxeSpine(kickSpineInfo.name);
            this.spineAxe.skeletonData = skeletonData;
        } catch (e) {}
    }

    loadAxeSpine(name: string) {
        console.log("loadAxeSpine  ", name);
        return bundleManager.loadResourcesAsset<sp.SkeletonData>(`spines/axe/${name}`, sp.SkeletonData);
    }

    @render(BetStore, (store) => store.endBet)
    handleEndBet(endBet: number) {
        if (endBet > 0) {
            this.updateBalance();
        }
    }

    @render(BetStore, (store) => store.settleStatus)
    handleSettleStatus(settleStatus: any) {
        if (settleStatus.win) {
            this.updateBalance();
        }
    }

    @handle(BalanceInfoHandler, (handler) => handler.updateBalance())
    updateBalance() {}

    onClickBetButton() {
        if (this.canBet) {
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
        if (this.touchInPolygon(event) && this.canBet) {
            this.onBet();
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

    getKickSpineInfo(level: number) {
        return { name: `kick/pickaxe-${level}-kick-animation`, animation: `pickaxe-${level}-kick` };
    }

    getCrashSpineInfo(level: number) {
        return { name: `crash/pickaxe-${level}-crash-animation`, animation: `pickaxe-${level}-crash-animation` };
    }

    getTransformSpineInfo(level: number) {
        return { name: `transformation/pickaxe_transformation${level - 1}_${level}`, animation: `pickaxe_${level - 1}_${level}` };
    }

    playTapAnimation() {
        const currentTapAnim = this.spineAxe;
        currentTapAnim.setAnimation(0, this.currentAnimationName, false);

        this.effect.setAnimation(0, `tap_3`, false);
    }

    async playCrashAnimation() {
        try {
            const level = this.getCurrentAnimationLevel(this.multiplier);
            const crashSpineInfo = this.getCrashSpineInfo(level);
            const skeletonData = await this.loadAxeSpine(crashSpineInfo.name);
            this.spineAxe.skeletonData = skeletonData;

            await AnimationUtils.playSpine(this.spineAxe, crashSpineInfo.animation, false);
            this.hideAxe();
        } catch (e) {}
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
        this.cashOutButton.active = uiState === BetUIState.Bet || uiState === BetUIState.Mining || uiState === BetUIState.Settle;
        this.hitStoneButton.active = uiState === BetUIState.Started;

        this.canBet = uiState > BetUIState.Start && uiState !== BetUIState.Settle;

        if (uiState === BetUIState.Started) {
            this.showAxe();
        }
    }

    @render(BetStore, (store) => store.multiplierVisible)
    updateMultiplierVisible(multiplierVisible: boolean) {
        this.lblMultiplier.node.active = multiplierVisible;
    }

    @render(BetStore, (store) => store.uiState)
    updateButtonInteractable(uiState: BetUIState) {
        const buttonCashOut = this.cashOutButton.getComponent(Button);
        buttonCashOut.interactable = uiState !== BetUIState.Settle;

        this.lblMoney.font = buttonCashOut.interactable ? this.activeMoneyFont : this.disableMoneyFont;
        const animation = this.lblMoney.getComponent(Animation);
        if (animation) {
            if (buttonCashOut.interactable) {
                animation.play();
            } else {
                animation.stop();
                this.lblMoney.node.scale = v3(1, 1, 1);
            }
        }
    }
}
