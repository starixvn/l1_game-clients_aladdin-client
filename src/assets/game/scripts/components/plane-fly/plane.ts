import { Component, Node, Tween, Vec3, _decorator, sp, tween, v3 } from "cc";
import { AnimationUtils } from "../../../../../extensions/shared-components/assets/shared/utils";

const { ccclass, property } = _decorator;

export const PlaneAnim = {
    START: "idle",
    FLY: "bay",
    PLANE_TAKE_OFF: "catcanh",
    IDLE: "idle",
    EXPLOSION: "crash",
    EXPLOSION_AT_GROUND: "snow",
    GIF: "gif",
};

@ccclass()
export class Plane extends Component {
    @property(Node)
    plane: Node = null;

    @property(Node)
    smoke: Node = null;

    @property(sp.Skeleton)
    spineBackground: sp.Skeleton = null;

    get skePlane(): sp.Skeleton {
        return this.plane.getChildByName("skeleton").getComponent(sp.Skeleton);
    }

    private positionTween: Tween<Node>;
    readonly durationPlanTakeOff = 1.6;
    readonly durationCrash = 0.4;
    readonly altitude = 185;
    readonly distanceTakeOff = 540;

    onLoad() {
        this.setPlaneVisibility(false);
        this.smoke.active = false;
    }

    startFly() {
        this.smoke.active = true;
        this.skePlane.setAnimation(0, PlaneAnim.FLY, true);
    }

    setPlaneAnim(name: string, loop: boolean) {
        this.skePlane?.setAnimation(0, name, loop);
    }

    setPlaneVisibility(status: boolean) {
        this.plane.active = status;
    }

    setExplosionPlaneVisibility() {
        this.setPlaneAnim(PlaneAnim.EXPLOSION, false);
        this.planeFall();
    }

    updatePosition(pos: Vec3) {
        this.node.position = pos;
    }

    preparePlane(animated = true) {
        this.smoke.active = false;
        this.node.active = true;
        this.setPlaneAnim(PlaneAnim.IDLE, true);
        this.stopAnimation();
        this.setPlaneVisibility(true);
        if (!animated) {
            return;
        }
    }

    explode() {
        this.stopAnimation();
        this.setExplosionPlaneVisibility();
        this.smoke.active = false;
        this.playBackgroundTransition();
    }

    stopAnimation() {
        this.positionTween?.stop();
    }

    async playBackgroundTransition() {
        this.spineBackground && (await AnimationUtils.playSpine(this.spineBackground, "transition"));
    }

    protected planeFall() {
        const plane = this.node;
        const currentAltitude = plane.position.y;
        const destPosition = v3(plane.position.x, 0, 0);
        const crashDuration = this.calculateFallDuration(currentAltitude);
        tween(plane)
            .parallel(
                tween().to(crashDuration, { position: destPosition, eulerAngles: v3(0, 0, 0) }, { easing: "quadIn" }),
                tween()
                    .delay(crashDuration - 0.1)
                    .call(() => {
                        this.skePlane.setAnimation(0, PlaneAnim.EXPLOSION_AT_GROUND, false);
                    })
            )

            .start();
    }

    private calculateFallDuration(currentAltitude: number): number {
        const ratio = currentAltitude / this.altitude;

        return Math.max(this.durationCrash * ratio, 0.1);
    }
}
