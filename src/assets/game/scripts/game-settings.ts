import gc from "@sg/game-client-base";
import * as CascadingSlotFeature from "db://shared-cascading-slot/index";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { sharedContainer } from "../../scripts/shared-container";
import { NullErrorHandlers } from "./null-errors-handlers";

const GAME_NAME = "WukongsRevenge";
export const settings = {
    id: 121,
    name: GAME_NAME,
    tolgeeNamespaces: [GAME_NAME, "cascadingslot"],
    durations: {
        wholeRound: 14,
        lockingBet: 3,
        placingBet: 10,
        generatingResult: 0,
        startRound: 1,

        bigWinNotice: 5,
        normalWinNotice: 3,
        loseNotice: 1,
    },
    numberOfRoundHistory: 11,
    validateBalanceWhenBet: true,
};

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(LogStore).to(LogStore);

        //container.bind(gc.Rounds.RoundTimeHandlers).to(NullRoundTimeHandlers);
        container.bind(gc.Error.ErrorHandlers).to(NullErrorHandlers);
    },
    features: [CascadingSlotFeature, gc.BetDetailsNew, ...gc.defaultFeatures],
};
