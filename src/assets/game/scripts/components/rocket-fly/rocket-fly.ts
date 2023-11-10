import gc from "@sg/game-client-base";
import { Node, Tween, UITransform, Vec3, _decorator, toDegree, tween, v3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import ColMultipliers from "../../../../../extensions/shared-components/assets/game-crash/col-multipliers/col-multipliers";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { Rocket } from "./rocket";
import { RocketTail } from "./rocket-tail";
const { fadeOut, fadeIn, getUiOpacity } = AnimationUtils;
const { ccclass, property } = _decorator;

const { render } = Observer;
const { GameCrash } = gc;
@ccclass
export class RocketFly extends ObserverComponent {
    @property(Rocket)
    cpnRocket: Rocket = null;

    @property(UITransform)
    transformRocketTail: UITransform = null;

    @property(Node)
    startPoint: Node = null;

    @property(Node)
    nodeColMultiplier: Node = null;

    @property({ type: RocketTail })
    rocketTails: RocketTail[] = [];

    private readonly startRotation = -90;
    private readonly grapWidth = 1098;
    private readonly grapMaxX = 9;
    private readonly speedRate = 2;
    private readonly graphScale = this.grapWidth / this.grapMaxX;
    private readonly rawLimitX = 6.5;
    private readonly smallExplosionMultiplier = 1.02;
    private currentMultiplier = 0;
    private deltaTime = 0;
    private startedRocketFlying = false;
    private reachedLimitX = false;
    private preparingRocket = false;
    private cpnColMultipliers: ColMultipliers;
    private get startPosition(): Vec3 {
        return this.startPoint.position;
    }

    onLoad() {
        this.cpnColMultipliers = this.nodeColMultiplier.getComponent(ColMultipliers);

        this.cpnRocket.updatePosition(this.startPosition, false);

        super.onLoad();
    }

    @render(gc.Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }), {
        fireImmediately: false,
    })
    renderRocketExplosion(data: { result: gc.GameServiceMessage.TResult; settlementResult: gc.GameServiceMessage.TSettlementResult }) {
        const { result } = data;
        if (result) {
            this.explodeRocket(+result < this.smallExplosionMultiplier);
            this.preparingRocket = false;
        }
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    setTimeByMultiplier(time: number) {
        if (time - this.deltaTime > 150) {
            const timePoint = time - 100;
            this.flyRocket(timePoint, false);
            this.movingRocketContainer(timePoint, false);
        }
        this.deltaTime = time;
        if (!this.reachedLimitX) {
            this.flyRocket(this.deltaTime);
            this.movingRocketContainer(this.deltaTime, true);
        }
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier, { fireImmediately: false })
    private setCurrentMultiplier(multiplier: number) {
        this.currentMultiplier = multiplier;
        this.cpnColMultipliers.handleScroll(this.cpnRocket.nodeRocketHead, this.currentMultiplier, true);

        if (!this.startedRocketFlying) {
            this.cpnRocket.startFly();
            this.startedRocketFlying = true;
        }
        this.checkSwapRocketTail(multiplier);
    }

    checkSwapRocketTail(multiplier: number) {
        const multipliers = [0, 5, 10];
        let next = 0;
        for (let index = 0; index < multipliers.length; index++) {
            const m = multipliers[index];
            if (multiplier < m) {
                break;
            }
            next = index;
        }

        const current = next - 1;
        if (current < 0 || this.rocketTails[0].currentIndex === next) {
            return;
        }

        this.swapRocketTail(next);
    }

    private swapRocketTail(next: number) {
        this.rocketTails.forEach((tail) => tail.swapRocketTail(next));
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.preparingRocket) {
            this.prepareForRocket(false);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }

        this.prepareForRocket(true);
        this.cpnColMultipliers.scrollUp();
    }

    private prepareForRocket(animated: boolean) {
        this.preparingRocket = true;
        this.updateRocketTailWidth(0);
        this.resetRocketTailNodes();
        this.cpnRocket.prepareRocket(this.startRotation, animated);
        this.cpnRocket.updatePosition(this.startPosition);
        this.resetRocketContainer();
        this.reachedLimitX = false;
    }

    private resetRocketTailNodes() {
        this.rocketTails.forEach((rocketTail) => {
            rocketTail.resetRocketTailNodes();
        });
    }

    calculateRocketPosition(rawX: number, scale: number) {
        const rawY = Math.pow(rawX, 4) / 600;
        return v3(rawX * scale, rawY * scale);
    }

    movingRocketContainer(time: number, animated: boolean) {
        const container = this.cpnRocket.node.parent;
        const ratio = Math.min(time / 8000, 1);
        const destX = 200 * ratio;

        const destPosition = v3(destX, container.position.y);
        if (animated) {
            Tween.stopAllByTarget(container);
            tween(container).to(0.1, { position: destPosition }).start();
        } else {
            container.position = destPosition;
        }
    }

    resetRocketContainer() {
        const container = this.cpnRocket.node.parent;
        container.position = v3(0, container.position.y);
    }

    flyRocket(time: number, animated = true) {
        this.cpnRocket.setRocketVisibility(true);

        const scale = this.graphScale;
        const rawLimitX = this.rawLimitX;

        let rawX = time * this.getTimerRate();

        if (rawX >= rawLimitX) {
            rawX = rawLimitX;
            this.reachedLimitX = true;
        }
        const newPosition = this.calculateRocketPosition(rawX, scale);
        const prevRocketPosition = this.calculateRocketPosition(rawX - 0.1, scale);
        const delta = {
            x: newPosition.x - prevRocketPosition.x,
            y: newPosition.y - prevRocketPosition.y,
        };

        this.updateRocketTailWidth(newPosition.x);
        const eulerAngle = this.startRotation + toDegree(Math.atan2(delta.y, delta.x));
        this.cpnRocket.updateRotation(eulerAngle, animated);
        this.cpnRocket.updatePosition(newPosition, animated);
    }

    private updateRocketTailWidth(width: number) {
        this.showRocketTail();
        const offset = width > 0 ? Math.abs(this.transformRocketTail.node.position.x) : 0;
        this.transformRocketTail.width = width + offset;
    }

    explodeRocket(isSMall: boolean) {
        this.hideRocketTail();
        this.startedRocketFlying = false;
        this.cpnRocket.explode(isSMall);
    }

    private showRocketTail() {
        this.transformRocketTail.node.active = true;
    }

    private hideRocketTail() {
        this.transformRocketTail.node.active = false;
    }

    getTimerRate() {
        const duration = 20 * 1000;
        const x = this.deltaTime / duration;
        const result = (1 - x) * (1 - x) * 1 + 0.5;
        return result / 2000;
    }
}
