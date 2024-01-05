import { Component, Node, UIOpacity, _decorator, tween, v3 } from "cc";
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
    a: any;

    start() {}

    update(deltaTime: number) {}

    onClickExplosion() {
        this.explosion.active = true;
        this.a = tween(this.explosion)
            .to(
                1.2,
                { scale: v3(2, 2, 2) },
                {
                    easing: (t) => {
                        const C1 = 0; // constant
                        const C2 = 1.2; // P0
                        const C3 = 1.8; // P1
                        const C4 = 1; // constant
                        const t1 = 1 - t;
                        return t1 * (t1 * (C1 + (C2 * 3 - C1) * t) + C3 * 3 * t * t) + C4 * t * t * t;
                    },
                }
            )
            .start();

        tween(this.explosion.getComponent(UIOpacity))
            .to(1.1, { opacity: 235 }, { easing: "sineOut" })
            .to(0.1, { opacity: 255 }, { easing: "sineIn" })
            .delay(1)
            .to(1, { opacity: 1 }, { easing: "sineOut" })
            .start();
    }

    onReset() {
        this.rocket.active = true;
        this.explosion.scale = v3(0, 0, 0);
        this.explosion.active = false;
        this.a.stop();
        this.explosion.getComponent(UIOpacity).opacity = 100;
    }
}
