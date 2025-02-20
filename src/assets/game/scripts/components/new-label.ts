import { _decorator, Component, Node, Label, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NewLabel')
export class NewLabel extends Label {
    @property
    minWidth = 0;

    @property
    maxWidth = 0;

    @property
    maxLengthString = 0;

    update() {
        this.maxLengthString > 0 && this.updateWidth();
    }

    updateWidth() {
        const uiTransform = this.node.getComponent(UITransform);
        if (this.string.length > this.maxLengthString) {
            this.overflow = Label.Overflow.SHRINK;
            uiTransform.width = this.maxWidth;
        } else {
            this.overflow = Label.Overflow.NONE;
            uiTransform.width = this.minWidth;
        }
    }

}


