import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";
import { BetChoice } from "../dtf-commons";
const { ccclass, property } = _decorator;

@ccclass("CustomLedLightTooltip")
export class CustomLedLightTooltip extends LedLightTooltip {
    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        this.roundId.string = `#${ledLightInfo.roundId}`;
        let winChoice = "";
        const choices = [BetChoice.Dragon, BetChoice.Tie, BetChoice.Tie];
        choices.forEach((choice) => {
            if (ledLightInfo.settlementResult[choice]) {
                winChoice = choice;
            }
        });

        const key = gc.Shared.l10n.t(winChoice);
        this.result.string = key;

        this.showTooltip();
    }
}
