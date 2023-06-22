import gc from "@sg/game-client-base";
import { _decorator, Animation, Component, Node, Sprite, SpriteFrame, tween, UIOpacity, v2, v3 } from "cc";
import Observer from "observer";
import { settings } from "../sedie-settings";

const { ccclass, property } = _decorator;
const { observer, handle } = Observer;

@ccclass
@observer(settings.name)
export class SediePlate extends Component {
    @property(Animation)
    animShakePlate: Animation = null;

    @property(Node)
    nodeTheBowl: Node = null;

    @property([Sprite])
    sprDots: Sprite[] = [];

    @property(SpriteFrame)
    sprDotRed: SpriteFrame = null;

    @property(SpriteFrame)
    sprDotWhite: SpriteFrame = null;

    openPlateDuration = 0.5;
    private audioShakeKey = "shake";

    setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.sprDots[index].spriteFrame = result[key] ? this.sprDotRed : this.sprDotWhite;
        });
    }

    toggleDotsActive(show: boolean) {
        this.sprDots.forEach((dot) => {
            dot.node.active = show;
        });
    }

    shakePlate() {
        tween(this.node)
            .delay(0.5)
            .call(() => {
                this.toggleDotsActive(false);
                this.playSoundShake();
                this.animShakePlate.play();
            })
            .start();
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundShake() {
        return this.audioShakeKey;
    }

    openBowl(animated: boolean) {
        this.toggleDotsActive(true);
        const platePos = v2(50, 100);

        if (animated) {
            tween(this.nodeTheBowl)
                .to(this.openPlateDuration, { position: v3(platePos.x, platePos.y) }, { easing: "sineInOut" })
                .start();
            tween(this.nodeTheBowl.getComponent(UIOpacity)).delay(this.openPlateDuration).to(0.2, { opacity: 0 }).start();
        } else {
            this.nodeTheBowl.position = v3(platePos.x, platePos.y);
            this.nodeTheBowl.getComponent(UIOpacity).opacity = 1;
        }
    }

    closeBowl(animated: boolean) {
        if (animated) {
            const platePos = v2(50, 100);
            this.nodeTheBowl.position = v3(platePos.x, platePos.y);
            tween(this.nodeTheBowl.getComponent(UIOpacity)).to(0, { opacity: 255 }).start();
            tween(this.nodeTheBowl)
                .to(0.5, { position: v3(0, 0) })
                .start();
        } else {
            this.nodeTheBowl.getComponent(UIOpacity).opacity = 255;
            this.nodeTheBowl.position = v3(0, 0);
        }
    }
}
