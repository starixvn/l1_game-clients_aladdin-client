import { _decorator } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer } = Observer;

@ccclass
@observer(settings.name)
export default class SedieBetItem extends BetItem {}
