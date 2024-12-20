import { _decorator, Node } from "cc";
import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import Observer from "observer";
import { AutoPlayHandler } from "../auto-play-handler";
import { AutoPlayStore } from "../auto-play-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoPlayPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(AutoPlayStore, (store) => store.isOpenAutoPlayPopup)
    renderOpenPopup(isOpenAutoPlayPopup: boolean) {
        this.nodeOverlay.active = isOpenAutoPlayPopup;
        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(AutoPlayHandler, (handle) => handle.closeAutoPlayPopup())
    onClickclosePopup() {}
}
