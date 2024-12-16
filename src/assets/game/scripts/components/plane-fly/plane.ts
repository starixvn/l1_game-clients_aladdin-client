import { Component, Node, Tween, Vec3, _decorator, sp, tween, v3, log } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";

const { ccclass, property } = _decorator;

export const PlaneAnim = {
    FLY: "bay",
    IDLE: "idle",
    SHAKE: "runglac",
    EXPLOSION: "crash",
    EXPLOSION_AT_GROUND: "snow",
};

@ccclass()
export class Plane extends Component {
    @property(Node)
    plane: Node = null;

    @property(Node)
    smoke: Node = null;

    @property(sp.Skeleton)
    spineBackground: sp.Skeleton = null;

    protected skePlane: sp.Skeleton = null;

    private positionTween: Tween<Node>;
    private planeCrashTween: Tween<Node>;
    readonly durationPlanTakeOff = 1.6;
    readonly durationCrash = 0.4;
    readonly altitude = 185;
    readonly distanceTakeOff = 540;

    onLoad() {
        this.setPlaneVisibility(false);
        this.smoke.active = false;
        this.skePlane = this.plane.getChildByName("skeleton").getComponent(sp.Skeleton);
    }

    startFly() {
        this.smoke.active = true;
        this.skePlane.setAnimation(0, PlaneAnim.FLY, true);
    }

    protected setPlaneAnim(name: string, loop: boolean) {
        this.skePlane?.setAnimation(0, name, loop);
    }

    setPlaneVisibility(status: boolean) {
        this.plane.active = status;
    }

    protected setExplosionPlaneVisibility() {
        const animationDuration = this.skePlane?.findAnimation(PlaneAnim.SHAKE).duration;
        this.setPlaneAnim(PlaneAnim.SHAKE, false);
        this.planeCrashTween = tween(this.node)
            .delay(animationDuration)
            .call(() => {
                this.setPlaneAnim(PlaneAnim.EXPLOSION, false);
                this.planeFall();
            })
            .start();
    }

    updatePosition(pos: Vec3) {
        this.node.position = pos;
    }

    preparePlane() {
        this.smoke.active = false;
        this.node.active = true;
        this.setPlaneAnim(PlaneAnim.IDLE, true);
        this.stopAnimation();
        this.setPlaneVisibility(true);
    }

    explode() {
        this.stopAnimation();
        this.setExplosionPlaneVisibility();
        this.smoke.active = false;
        this.playBackgroundTransition();
    }

    protected stopAnimation() {
        this.positionTween?.stop();
        this.planeCrashTween?.stop();
    }

    protected playBackgroundTransition() {
        try {
            this.spineBackground && AnimationUtils.playSpine(this.spineBackground, "transition");
        } catch (error) {
            log(`Play background transition error`, error);
        }
    }

    protected planeFall() {
        const plane = this.node;
        const currentAltitude = plane.position.y;
        const destPosition = v3(plane.position.x, 0, 0);
        const crashDuration = this.calculateFallDuration(currentAltitude);
        plane &&
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
