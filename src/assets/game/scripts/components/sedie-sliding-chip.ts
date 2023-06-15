import { _decorator } from "cc";
import SlidingChip from "db://shared-components/game/sliding-chip/scripts/components/sliding-chip";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export class SedieSlidingChip extends SlidingChip {}
