import gc from "@sg/game-client-base";
import { FunctionUtils } from "db://shared-components/shared/utils";
import inversify from "inversify";
import { BetAmountStore } from "../bet-amount/bet-amount-store";
import { BetHandler } from "../bets/bet-handler";
import { AutoStartStore } from "./auto-start-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoStartHandler{
    @inject(AutoStartStore) protected readonly autoStartStore: AutoStartStore;

    updateAutoStart() {
        this.autoStartStore.isAutoStart = !this.autoStartStore.isAutoStart;
    }
}