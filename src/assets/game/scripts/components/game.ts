import { _decorator } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import { siteConfigs } from "../../../scripts/site-configs";
import { CascadingSlotGame } from "../../cascading-slot/cascading-slot-game";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends CascadingSlotGame {}
