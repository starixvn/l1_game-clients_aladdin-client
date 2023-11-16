import { _decorator, Component, Node, ParticleSystem2D, sp, Tween, tween, v3, Vec3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";

import { SpaceManList } from "./space-man-list";

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

    @property(SpaceManList)
    cpnSpaceManList: SpaceManList = null;

    @property(Node)
    nodeTailStart: Node = null;

    @property(ParticleSystem2D)
    flyParticle: ParticleSystem2D = null;

    get skeExplosion(): sp.Skeleton {
        return this.explosion.getComponent(sp.Skeleton);
    }
    get skeRocket(): sp.Skeleton {
        return this.rocket.getComponentInChildren(sp.Skeleton);
    }

    private rotationTween: Tween<Node>;
    private positionTween: Tween<Node>;
    private explositionTween: Tween<Node>;

    onLoad() {
        this.setRocketVisibility(false);
        this.setExplosionRocketVisibility(false);
        this.setSpaceManVisibility(false);
    }

    startFly() {
        this.setRocketAnim(RocketAnim.FLY, true);
        this.flyParticle.stopSystem();
        this.flyParticle.speed = 0;
        this.flyParticle.resetSystem();
        tween(this.flyParticle).to(1, { speed: 100 }).start();
    }

    setSpaceManVisibility(status: boolean) {
        this.cpnSpaceManList.node.active = status;
        status && this.cpnSpaceManList.setVisibility(status);
        // status && this.skeSpaceMan.setAnimation(0, "action", false);
    }

    setRocketAnim(name: string, loop: boolean) {
        this.skeRocket?.setAnimation(0, name, true);
        this.updateTailVisibility(name);
    }

    updateTailVisibility(name: string) {
        this.nodeTailStart.active = name === RocketAnim.START;
        this.nodeRocketTail.active = name === RocketAnim.FLY;
        if (name === RocketAnim.IDLE) {
            this.flyParticle.stopSystem();
        }
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

    prepareRocket(startRotation: number, animated = true) {
        this.node.active = true;
        this.setRocketAnim(RocketAnim.IDLE, false);
        this.stopAnimation();
        this.setRocketVisibility(true);
        this.setExplosionRocketVisibility(false);
        const onFinished = () => {
            this.setSpaceManVisibility(false);
            this.setRocketAnim(RocketAnim.START, true);
        };
        if (!animated) {
            onFinished();
            return;
        }
        tween(this.node)
            .call(() => {
                this.updateRotation(0);
                this.setSpaceManVisibility(true);
            })
            .delay(2)
            .to(2, { eulerAngles: v3(0, 0, startRotation) }, { easing: "sineOut" })
            .delay(2)
            .call(() => {
                onFinished();
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
