import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export default class PlaceBetButton extends ObserverComponent {
    @handle(gc.GameInstantWin.InstantWinBet.BetHandler, (handler) => handler.handle())
    onBet() {}
}
