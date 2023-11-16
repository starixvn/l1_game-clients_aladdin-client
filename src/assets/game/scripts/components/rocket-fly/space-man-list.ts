import { _decorator, Component, instantiate, Prefab } from "cc";

import { SpaceMan } from "./space-man";

const { ccclass, property } = _decorator;

@ccclass
export class SpaceManList extends Component {
    @property(Prefab)
    prfSpaceMan: Prefab = null;

    @property
    spaceManNumber = 3;

    @property
    spaceManDistance = 40;

    private readonly firstSpaceManPosX = 120;

    onLoad() {
        this.initSpaceManList();
    }

    setVisibility(status: boolean) {
        this.node.active = status;

        if (status) {
            this.node.getComponentsInChildren(SpaceMan).forEach((spaceMan) => {
                spaceMan.walk();
            });
        }
    }

    initSpaceManList() {
        this.node.destroyAllChildren();
        for (let i = 0; i < this.spaceManNumber; i++) {
            const spaceManNode = instantiate(this.prfSpaceMan);
            this.node.addChild(spaceManNode);
            const spaceManComp = spaceManNode.getComponent(SpaceMan);
            const posX = this.firstSpaceManPosX + i * this.spaceManDistance;
            spaceManComp.defaultPosX = posX;
        }
    }
}
