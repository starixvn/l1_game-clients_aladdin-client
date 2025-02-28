import gc from "@sg/game-client-base";
import { _decorator, Component, Label } from "cc";
import { truncatedNickname } from "db://shared-components/shared/utils/utils";
import Observer from "observer";
import { TopWinner } from "../top-winners-store";
const { ccclass, property } = _decorator;

const { Rounds, FormatUtils } = gc;
const { render, handle } = Observer;

@ccclass
export class TopWinnerItem extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblBalance: Label = null;

    setData(data: TopWinner) {
        this.lblName.string = truncatedNickname(data.name);
        this.lblBalance.string = FormatUtils.numberWithCommas(data.win, 2);
    }
}
