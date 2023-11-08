import { Component, Node, Tween, Vec3, _decorator, sp, tween, v3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
const { fadeOut, fadeIn, getUiOpacity } = AnimationUtils;
const { ccclass, property } = _decorator;

export const RocketAnim = {
    START: "rocket-start",
    FLY: "rocket-fly",
    IDLE: "rocket-idle",
    EXPLOSION_BIG: "explosion-big",
    EXPLOSION_SMALL: "explosion-small",
};

@ccclass()
export class Rocket extends Component {
    @property(Node)
    rocket: Node = null;

    @property(Node)
    explosion: Node = null;

    @property(Node)
    nodeRocketHead: Node = null;

    @property(Node)
    nodeRocketTail: Node = null;

    @property(Node)
    nodeSpaceMan: Node = null;

    @property(Node)
    nodeTailStart: Node = null;

    get skeExplosion(): sp.Skeleton {
        return this.explosion.getComponent(sp.Skeleton);
    }
    get skeRocket(): sp.Skeleton {
        return this.rocket.getComponentInChildren(sp.Skeleton);
    }

    get skeSpaceMan(): sp.Skeleton {
        return this.nodeSpaceMan.getComponent(sp.Skeleton);
    }
    private rotationTween: Tween<Node>;
    private positionTween: Tween<Node>;
    private explositionTween: Tween<Node>;

    onLoad() {
        this.setRocketVisibility(false);
        this.setExplosionRocketVisibility(false);
        this.setSpaceManVisibility(false);
    }

    setSpaceManVisibility(status: boolean) {
        this.nodeSpaceMan.active = status;
        status && this.skeSpaceMan.setAnimation(0, "action", false);
    }

    setRocketAnim(name: string, loop: boolean) {
        this.skeRocket?.setAnimation(0, name, true);
        this.updateTailVisibility(name);
    }

    updateTailVisibility(name: string) {
        this.nodeTailStart.active = name === RocketAnim.START;
        this.nodeRocketTail.active = name === RocketAnim.FLY;
    }

    setRocketVisibility(status: boolean) {
        this.rocket.active = status;
    }

    setExplosionRocketVisibility(status: boolean) {
        this.explosion.active = status;
    }

    updateRotation(angle: number, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.rotationTween?.stop();
            this.rotationTween = tween(this.node)
                .to(duration, { eulerAngles: v3(0, 0, angle) })
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

    prepareRocket(startRotation: number) {
        this.node.active = true;
        this.setRocketAnim(RocketAnim.IDLE, false);
        this.stopAnimation();
        this.setRocketVisibility(true);
        this.setExplosionRocketVisibility(false);
        tween(this.node)
            .call(() => {
                this.updateRotation(0);
                this.setSpaceManVisibility(true);
            })
            .delay(2)
            .to(2, { eulerAngles: v3(0, 0, startRotation) }, { easing: "sineOut" })
            .delay(2)
            .call(() => {
                this.setSpaceManVisibility(false);
                this.setRocketAnim(RocketAnim.START, true);
            })
            .union()
            .start();
    }

    explode(smallExplosion: boolean) {
        this.stopAnimation();
        this.setRocketVisibility(false);
        this.setExplosionRocketVisibility(true);

        const animName = smallExplosion ? RocketAnim.EXPLOSION_SMALL : RocketAnim.EXPLOSION_BIG;
        const duration = this.skeExplosion.findAnimation(animName).duration;
        this.skeExplosion.setAnimation(0, animName, false);
        this.explositionTween = tween(this.node)
            .delay(duration)
            .call(() => {
                this.explosion.active = false;
            })
            .start();
    }

    stopAnimation() {
        this.rotationTween?.stop();
        this.positionTween?.stop();
        this.explositionTween?.stop();
    }
}
