import { _decorator } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import GameCrashComponent from "../../../../extensions/shared-components/assets/game-crash/scripts/components/game-crash-component";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import "./../../../resources/i18n";

startGame(settings.name, containerOptions, siteConfigs, [settings.namespaces]);

const { ccclass } = _decorator;
const { observer } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameCrashComponent {
    override namespace = settings.name;
    override containerOptions = containerOptions;
}
