import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label } from "cc";
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

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }

    private readonly truncatedNickname = (nickname: string) => {
        let truncatedNickname = "";

        if (nickname) {
            if (nickname.length > 10) {
                truncatedNickname = `${nickname.substring(0, 10)}...`;
            } else {
                truncatedNickname = nickname;
            }
        }

        return truncatedNickname;
    };

    setData(data: TopWinner, isMainPlayer: boolean) {
        this.lblName.string = isMainPlayer ? this.truncatedNickname(data.name) : this.encryptedName(data.name);
        this.lblName.color = isMainPlayer ? new Color("#FCE966") : new Color("#41DEFF");
        this.lblBalance.string = "+" + FormatUtils.numberWithCommas(data.winningAmount, 2);
    }
}
