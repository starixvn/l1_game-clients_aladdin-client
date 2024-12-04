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
    readonly durationPlanTakeOff = 1600;

    onLoad() {
        this.setRocketVisibility(false);
        this.setExplosionRocketVisibility(false);
    }

    startFly(time: number) {
        // const isFullTme = time < this.durationPlanTakeOff;
        // isFullTme && this.setRocketAnim(PlaneAnim.PLANE_TAKE_OFF, false);
        // const duration = this.skePlane?.findAnimation(PlaneAnim.PLANE_TAKE_OFF).duration;
        // duration > 0 &&
        //     tween(this.node)
        //         .delay(isFullTme ? duration : 0)
        //         .call(() => {
        //             this.skePlane.setAnimation(0, PlaneAnim.FLY, true);
        //         })
        //         .start();
        this.skePlane.setAnimation(0, PlaneAnim.FLY, true);
    }

    setRocketAnim(name: string, loop: boolean) {
        this.skePlane?.setAnimation(0, name, loop);
    }

    setRocketVisibility(status: boolean) {
        this.plane.active = status;
    }

    setExplosionRocketVisibility(status: boolean) {
        status && this.setRocketAnim(PlaneAnim.EXPLOSION, false);
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

    prepareRocket(startRotation: number, animated = true) {
        this.node.active = true;
        this.setRocketAnim(PlaneAnim.IDLE, true);
        this.stopAnimation();
        this.setRocketVisibility(true);
        this.setExplosionRocketVisibility(false);
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
        this.setExplosionRocketVisibility(true);
    }

    stopAnimation() {
        this.rotationTween?.stop();
        this.positionTween?.stop();
    }
}
