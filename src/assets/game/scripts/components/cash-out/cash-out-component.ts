import { Label, Node, Sprite } from "cc";
export namespace CashOutComponent {
    export const showHideNode = (node: Node, isRocketFlyWithCashout: boolean, isShowPlaceBetNextRound: boolean) => {
        if (isRocketFlyWithCashout && !isShowPlaceBetNextRound) {
            node.active = true;
        } else {
            node.active = false;
        }
    };

    export const getBetValue = (lastReceivedBet: any) => {
        if (lastReceivedBet) {
            const lastestBet = lastReceivedBet.value;
            if (lastestBet >= 0) {
                return lastestBet;
            }
        }
    };

    export const updateCashOutButton = (isCashedOut: boolean, sprDisabled: Sprite) => {
        sprDisabled.node.active = isCashedOut;
    };

    export const getCashOutValue = (lblCashOut: Label) => {
        return +lblCashOut.string;
    };

    export const updateValueCashOut = (cashOutValue: number, lblCashOut: Label) => {
        lblCashOut.string = cashOutValue.toString();
    };
}
