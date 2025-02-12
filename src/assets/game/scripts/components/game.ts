import { _decorator, Label, Node } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";
import { BetStore, SettleStatus } from "./bets/bet-store";
import { CashOutHistoryHandlers } from "./cash-out-history/cash-out-history-handlers";
import { GameWinNotice } from "./game-win-notice";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

export interface IWinInstantResult {
    betWin: number;
    bigWin: true;
}

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, visible: false, override: true })
    lblMinBet: Label = null;

    @property({ type: Label, visible: false, override: true })
    lblMaxBet: Label = null;

    @property(Node)
    private normalWinNotice: Node = null;

    @property(Node)
    private bigWinNotice: Node = null;

    override namespace = settings.name;
    protected override enableEventShowHideGame = false;
    override containerOptions = containerOptions;

    @render(BetStore, (store) => store.roundId)
    renderlblRound(roundId: number) {
        this.lblRoundId && roundId !== 0 && (this.lblRoundId.string = `#${roundId}`);
    }

    @render(BetStore, (store) => store.settleStatus)
    renderSettleStatus(settleStatus: SettleStatus) {
        if (Object.keys(settleStatus).length === 0) {
            return;
        }

        if (!settleStatus.win) {
            return;
        }

        const isBigWin = settleStatus.isBigWin;

        const node = isBigWin ? this.bigWinNotice : this.normalWinNotice;
        const winNotice = node.getComponent(GameWinNotice);
        winNotice.show();

        this.addCashOutHistory();
    }

    @handle(CashOutHistoryHandlers, (handler) => handler.addCashOutHistory())
    addCashOutHistory() {}
}
