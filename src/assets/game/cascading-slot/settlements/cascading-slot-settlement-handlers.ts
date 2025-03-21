import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;

import { GameServiceMessage } from "../game-messages";
import { CascadingSlotSettlementStore } from "./cascading-slot-settlement-store";

@injectable()
export class CascadingSlotSettlementHandlers implements gc.Shared.IMultipleHandlers {
    @inject(CascadingSlotSettlementStore) protected readonly settlementStore: CascadingSlotSettlementStore;
    handleFinish(data: GameServiceMessage.CascadingSlotFinish) {
        this.settlementStore.dataFinish = data;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.CascadingSlotFinish.eventName,
            handle: this.handleFinish,
        },
    ];
}
