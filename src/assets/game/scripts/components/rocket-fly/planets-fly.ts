import gc from "@sg/game-client-base";
import { Layers, Node, Sprite, SpriteAtlas, Tween, UITransform, _decorator, tween, v3 } from "cc";
import { random } from "lodash-es";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
const { ccclass, property } = _decorator;
const { Settlements, GameCrash } = gc;
const { render, handle } = Observer;
@ccclass
export class PlanetsFly extends ObserverComponent {
    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    private readonly spritePrefix = "planet";
    private readonly planetsCount = 5;

    private startPlanetFlying = false;

    private planetSpritesDict = {};
    private lastSelectIndex = -1;

    onLoad() {
        this.resetPlanetSpriteDict();
        for (let i = 0; i < this.planetsCount; i++) {
            this.createNewPlanets(i);
        }
        super.onLoad();
    }

    resetPlanetSpriteDict() {
        for (let i = 0; i < 12; i++) {
            this.planetSpritesDict[i] = false;
        }
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    renderRocketTime(time: number) {
        if (!this.startPlanetFlying && time > 12000) {
            this.startPlanetFlying = true;
            this.resetPlanetSpriteDict();
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
        this.node.children.forEach((node) => this.movePlanet(node));
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

    getRandomMovingDuration() {
        return random(4, 6);
    }

    movePlanet(node: Node) {
        const transform = this.node.getComponent(UITransform);
        const maxX = transform.width * 0.5;

        const destPos = v3(-1.5 * maxX, node.position.y);
        tween(node)
            .to(this.getRandomMovingDuration(), {
                position: destPos,
                scale: v3(1, 1).multiplyScalar(0.3),
            })
            .call(() => {
                this.resetPlanet(node);
                this.movePlanet(node);
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
        const startPos = v3(2 * maxX, randomY);

        node.position = startPos;
        node.scale = v3(1, 1);
    }

    randomPlanetSprite(node: Node) {
        const sprite = node.getComponent(Sprite);
        let unselecteds = this.getUnSelectedSprites();
        if (unselecteds.length === 0) {
            this.resetPlanetSpriteDict();
            this.planetSpritesDict[this.lastSelectIndex] = true;
            unselecteds = this.getUnSelectedSprites();
        }
        const randomId = random(0, unselecteds.length);
        const index = unselecteds[randomId];
        this.planetSpritesDict[index] = true;
        this.lastSelectIndex = +index;
        sprite.spriteFrame = this.mainAtlas.getSpriteFrame(`${this.spritePrefix}-${index}`);
    }

    getUnSelectedSprites(): string[] {
        return Object.keys(this.planetSpritesDict).filter((key) => !this.planetSpritesDict[key]);
    }
}
