import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("winner")
export class Winner extends Component {
    @property(Label)
    lblBetWin: Label = null;

    setData(data: any) {
        this.lblBetWin.string = `+${gc.FormatUtils.numberWithCommas(data.betWin, 2)}`;
    }
}
