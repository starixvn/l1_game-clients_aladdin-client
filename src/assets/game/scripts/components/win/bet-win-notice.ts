import { _decorator, Component, Label } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class BetWinNotice extends Component {
    @property(Label)
    lblBetWin: Label = null;

    setBetWin(betWin: number, fadeOut: boolean, onFinish: () => void) {
    }
}
