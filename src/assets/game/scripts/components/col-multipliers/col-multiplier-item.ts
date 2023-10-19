import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;

@ccclass("col_multiplier_item")
export class ColMultiplierItem extends Component {
    @property(Label)
    lblMultiplier: Label = null;

    setMultiplier(value: string) {
        this.lblMultiplier.string = `${value}`;
    }
}
