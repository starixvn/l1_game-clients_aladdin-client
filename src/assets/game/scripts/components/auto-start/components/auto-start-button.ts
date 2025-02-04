import { _decorator, Component, Node } from 'cc';
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { AutoStartHandler } from "../auto-start-handler";
import { AutoStartStore } from "../auto-start-store";

const { ccclass, property } = _decorator;
const { handle, render } = Observer;

@ccclass
export class AutoStartButton extends ObserverComponent {
    @property(Node)
    private buttonAutoStart: Node = null;

    @property(Node)
    private iconAutoStartOn: Node = null;

    @property(Node)
    private iconAutoStartOff: Node = null;

    onLoad() {
        super.onLoad();
        this.addEvent();
    }

    @handle(AutoStartHandler, (handle) => handle.updateAutoStart())
    onClickAutoStartButton(){
    }

    @render(AutoStartStore, (store) => store.isAutoStart)
    updateIconAutoStart(isAutoStart: boolean){
        this.iconAutoStartOn.active = isAutoStart;
        this.iconAutoStartOff.active = !isAutoStart;
    }

    addEvent() {
        this.buttonAutoStart.on(Node.EventType.MOUSE_MOVE, this.eventOnEnter, this);
        this.buttonAutoStart.on(Node.EventType.MOUSE_LEAVE, this.resetCursor, this);
    }

    eventOnEnter() {
        document.body.style.cursor = "pointer";
    }

    resetCursor() {
        document.body.style.cursor = "default";
    }
}


