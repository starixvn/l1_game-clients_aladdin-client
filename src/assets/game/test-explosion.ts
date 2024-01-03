import { _decorator, Component, Node, tween, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TestExplosion")
export class TestExplosion extends Component {
    @property(Node)
    rocket: Node = null;

    @property(Node)
    explosion: Node = null;

    protected onLoad(): void {
        this.explosion.active = false;
    }

    start() {}

    update(deltaTime: number) {}

    onClickExplosion() {
        // handle anim
        // this.rocket.active = false;
        this.explosion.active = true;
        this.explosion.scale = v3(0.2, 0.2, 0.2);
        tween(this.explosion)
            .to(0.8, { scale: v3(1.7, 1.7, 1.7) }, { easing: "backOut" })
            .start();
    }

    onReset() {
        this.rocket.active = true;
        this.explosion.scale = v3(0.2, 0.2, 0.2);
        this.explosion.active = false;
    }
}
