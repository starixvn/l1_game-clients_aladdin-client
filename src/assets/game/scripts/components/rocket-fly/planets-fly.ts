import gc from "@sg/game-client-base";
import { Layers, Node, Sprite, SpriteAtlas, Tween, UITransform, _decorator, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { Settlements } = gc;
const { render, handle } = Observer;
@ccclass
export class PlanetsFly extends ObserverComponent {
    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    private readonly spritePrefix = "planet";
    private readonly planetsCount = 5;

    private startPlanetFlying = false;

    onLoad() {
        for (let i = 0; i < this.planetsCount; i++) {
            this.createNewPlanets(i);
        }
        super.onLoad();
    }

    @render(gc.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderRocketTime(time: number) {
        if (!this.startPlanetFlying && time > 12000) {
            this.startPlanetFlying = true;
            this.startMoving();
        }
    }

    @render(Settlements.SettlementStore, (store) => ({ result: store.result, settlementResult: store.settlementResult }))
    stopMoving() {
        this.node.children.forEach((node) => Tween.stopAllByTarget(node));
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    changeIdleAnim(isStartRound) {
        if (isStartRound) {
            this.startPlanetFlying = false;
            this.node.children.forEach((node) => this.resetPlanet(node));
        }
    }

    startMoving() {
        this.node.children.forEach((node) => this.changePlanet(node));
    }

    createNewPlanets(index: number) {
        const node = new Node();
        node.addComponent(Sprite);
        node.layer = Layers.Enum.UI_2D;
        node.name = index.toString();

        this.node.addChild(node);
        this.resetPlanet(node);
    }

    private resetPlanet(node: Node) {
        this.randomPlanetSprite(node);
        this.resetPlanetPosition(node);
    }

    movePlanet(node: Node) {
        const transform = this.node.getComponent(UITransform);
        const maxX = transform.width * 0.5;

        const destPos = v3(-1.1 * maxX, node.position.y);
        tween(node)
            .to(random(5, 10), {
                position: destPos,
                scale: v3(1, 1).multiplyScalar(0.3),
            })

            .call(() => {
                this.resetPlanet(node);
                this.changePlanet(node);
            })
            .start();
    }

    private resetPlanetPosition(node: Node) {
        const transform = this.node.getComponent(UITransform);
        const maxX = transform.width * 0.5;
        const maxY = transform.height * 0.5;

        const lineIndex = +node.name;
        const fromY = (lineIndex / this.planetsCount) * transform.height;
        const toY = ((lineIndex + 1) / this.planetsCount) * transform.height;
        const randomY = -maxY + random(fromY, toY);
        const startPos = v3(1.5 * maxX, randomY);

        node.position = startPos;
        node.scale = v3(1, 1);
    }

    changePlanet(node: Node) {
        tween(node)
            .delay(random(1, 5))
            .call(() => {
                this.movePlanet(node);
            })
            .start();
    }

    randomPlanetSprite(node: Node) {
        const sprite = node.getComponent(Sprite);

        const index = random(0, 12);
        sprite.spriteFrame = this.mainAtlas.getSpriteFrame(`${this.spritePrefix}-${index}`);
    }
}
