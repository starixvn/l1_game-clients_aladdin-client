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
        const durationAnimExplosion = 1.2;
        const durationOpacity = 1;
        this.explosion.active = true;
        this.explosion.scale = v3(0.2, 0.2, 0.2);
        tween(this.explosion)
            .to(durationOpacity, { scale: v3(2, 2, 2) }, { easing: "backOut" })
            .to(durationAnimExplosion - durationOpacity, { scale: v3(1.95, 1.95, 1.95) }, { easing: "sineOut" });
    }

    onReset() {
        this.rocket.active = true;
        this.explosion.scale = v3(0.2, 0.2, 0.2);
        this.explosion.active = false;
    }
}
