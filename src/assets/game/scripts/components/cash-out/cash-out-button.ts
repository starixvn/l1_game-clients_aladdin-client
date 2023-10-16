import { Label, _decorator } from "cc";
import Observer from "observer";
import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { handle, render } = Observer;
const { property, ccclass } = _decorator;

@ccclass
export class CashoutButton extends ObserverComponent {
    @property(Label)
    lblCashOut: Label = null;
}
