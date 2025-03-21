import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../game-messages";
import { CascadingSlotConfigsStore } from "./cascading-slot-configs-store";
const { injectable, inject } = inversify;

@injectable()
export class CascadingSlotConfigsHandlers implements gc.Shared.IMultipleHandlers {
    @inject(CascadingSlotConfigsStore) protected readonly configStore: CascadingSlotConfigsStore;
    handleGameConfigs(gameConfigs: GameServiceMessage.CascadingSlotConfigs) {
        this.configStore.gameConfigs = gameConfigs;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.CascadingSlotConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
