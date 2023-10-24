import { _decorator, Component, Node, sp, Tween, tween, v3, Vec3 } from "cc";

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

    skeExplosion: sp.Skeleton = null;
    skeRocket: sp.Skeleton = null;
    private rotationTween: Tween<Node>;
    private positionTween: Tween<Node>;
    private explositionTween: Tween<Node>;

    onLoad() {
        this.skeRocket = this.rocket.getComponent(sp.Skeleton);
        this.skeExplosion = this.explosion.getComponent(sp.Skeleton);
    }

    setRocketAnim(name: string, loop: boolean) {
        this.skeRocket.setAnimation(0, name, true);
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

    explode(isSMall: boolean) {
        const animName = isSMall ? RocketAnim.EXPLOSION_SMALL : RocketAnim.EXPLOSION_BIG;
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
