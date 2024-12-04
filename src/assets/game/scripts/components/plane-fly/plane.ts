import { Component, Node, Tween, Vec3, _decorator, sp, tween, v3 } from "cc";

const { ccclass, property } = _decorator;

export const PlaneAnim = {
    START: "idle",
    FLY: "bay",
    PLANE_TAKE_OFF: "catcanh",
    IDLE: "idle",
    EXPLOSION: "crash",
};

@ccclass()
export class Plane extends Component {
    @property(Node)
    plane: Node = null;

    get skePlane(): sp.Skeleton {
        return this.plane.getChildByName("skeleton").getComponent(sp.Skeleton);
    }

    private rotationTween: Tween<Node>;
    private positionTween: Tween<Node>;
    readonly durationPlanTakeOff = 1.6;
    readonly altitude = 185;
    readonly distanceTakeOff = 200;

    onLoad() {
        this.setPlaneVisibility(false);
        this.setExplosionPlaneVisibility(false);
    }

    startFly() {
        this.skePlane.setAnimation(0, PlaneAnim.FLY, true);
    }

    setPlaneAnim(name: string, loop: boolean) {
        this.skePlane?.setAnimation(0, name, loop);
    }

    setPlaneVisibility(status: boolean) {
        this.plane.active = status;
    }

    setExplosionPlaneVisibility(status: boolean) {
        status && this.setPlaneAnim(PlaneAnim.EXPLOSION, false);
    }

    updateRotation(angle: number, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.rotationTween?.stop();
            this.rotationTween = tween(this.node)
                .to(0.1, { eulerAngles: v3(0, 0, angle) })
                .start();
        } else {
            this.node.eulerAngles = v3(0, 0, angle);
        }
    }

    updatePosition(pos: Vec3, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.positionTween?.stop();
            this.positionTween = tween(this.node).to(duration, { position: pos }).start();
        } else {
            this.node.position = pos;
        }
    }

    preparePlane(startRotation: number, animated = true) {
        this.node.active = true;
        this.setPlaneAnim(PlaneAnim.IDLE, true);
        this.stopAnimation();
        this.setPlaneVisibility(true);
        this.setExplosionPlaneVisibility(false);
        const onFinished = () => {};
        if (!animated) {
            onFinished();
            return;
        }
        this.updateRotation(0);
        tween(this.node)
            .delay(2)
            .to(2, { eulerAngles: v3(0, 0, startRotation) }, { easing: "sineOut" })
            .delay(2)
            .call(() => {
                onFinished();
            })
            .start();
    }

    explode() {
        this.stopAnimation();
        this.setExplosionPlaneVisibility(true);
    }

    stopAnimation() {
        this.rotationTween?.stop();
        this.positionTween?.stop();
    }
}
