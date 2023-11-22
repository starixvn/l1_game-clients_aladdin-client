import gc from "@sg/game-client-base";
import { Node, Tween, UITransform, Vec3, _decorator, toDegree, tween, v3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import ColMultipliers from "../../../../../extensions/shared-components/assets/game-crash/col-multipliers/col-multipliers";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { Rocket } from "./rocket";
const { fadeOut, fadeIn, getUiOpacity } = AnimationUtils;
const { ccclass, property } = _decorator;

const { render } = Observer;
const { GameCrash } = gc;

type TweenDeltaTime = {
    deltaTime: number;
};
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
    private readonly startRotation = -90;
    private readonly grapWidth = 500;
    private readonly grapMaxX = 32;
    private readonly rawLimitX = 30;
    private readonly graphScale = this.grapWidth / this.grapMaxX;
    private readonly smallExplosionMultiplier = 1.02;
    private deltaTime = 0;
    private startedRocketFlying = false;
    private reachedLimitX = false;
    private preparingRocket = false;
    private cpnColMultipliers: ColMultipliers;
    private readonly graphTranslateX = 630;
    private readonly graphTranslateDuration = (this.rawLimitX + 4) * 1000;
    private tweenDeltaTime: Tween<TweenDeltaTime>;

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
            this.updateDeltaTime(timePoint);
        }
        this.cpnRocket.setRocketVisibility(true);
        const tweenObject = {
            deltaTime: this.deltaTime,
        };
        this.tweenDeltaTime?.stop();
        this.tweenDeltaTime = tween(tweenObject)
            .to(
                0.1,
                {
                    deltaTime: time,
                },
                {
                    onUpdate: () => {
                        this.updateDeltaTime(tweenObject.deltaTime);
                    },
                }
            )
            .start();

        if (!this.startedRocketFlying) {
            this.cpnRocket.startFly();
            this.startedRocketFlying = true;
        }
    }

    private updateDeltaTime(deltaTime: number) {
        this.deltaTime = deltaTime;
        if (!this.reachedLimitX) {
            this.flyRocket(this.deltaTime, false);
            this.movingRocketContainer(this.deltaTime, false);
        }
        this.cpnColMultipliers.handleScroll(
            this.cpnRocket.nodeRocketHead,
            this.calculateMultiplier(this.getTimeInSeconds(this.deltaTime)),
            false
        );
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
        this.cpnRocket.prepareRocket(this.startRotation, animated);
        this.cpnRocket.updatePosition(this.startPosition);
        this.resetRocketContainer();
        this.reachedLimitX = false;
        this.deltaTime = 0;
    }

    calculateRocketPosition(rawX: number, scale: number) {
        const rawY = this.calculateMultiplier(rawX) - 1;
        return v3(rawX * scale, rawY * scale);
    }

    calculateMultiplier(time: number) {
        const a = 0.04;
        const b = 0.66;
        const c = 1 - Math.pow(b, 5);
        return Math.pow(a * time + b, 5) + c;
    }

    movingRocketContainer(time: number, animated: boolean) {
        const container = this.cpnRocket.node.parent;
        const ratio = Math.min(time / this.graphTranslateDuration, 1);
        const destX = this.graphTranslateX * ratio;

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

    getTimeInSeconds(time: number) {
        return time / 1000;
    }

    flyRocket(time: number, animated = true) {
        const scale = this.graphScale;
        const rawLimitX = this.rawLimitX;

        let rawX = this.getTimeInSeconds(time) * this.getTimerRate();

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
        this.tweenDeltaTime?.stop();
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
        const x = Math.min(1, this.deltaTime / this.graphTranslateDuration);
        return Math.pow(1 - x, 2) + 1;
    }
}
