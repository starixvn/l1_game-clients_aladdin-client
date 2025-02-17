import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import * as InstantWinFeature from "../scripts";

import { sharedContainer } from "../../scripts/shared-container";

export const settings = {
    id: 109,
    name: "CoinMining",
    namespaces: ["CoinMining"],
    durations: {
        wholeRound: 14,
        lockingBet: 3,
        placingBet: 10,
        generatingResult: 0,
        startRound: 1,

        bigWinNotice: 5,
        normalWinNotice: 3,
    },
    numberOfRoundHistory: 11,
    validateBalanceWhenBet: true,
};

export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(LogStore).to(LogStore);
    },
    features: [InstantWinFeature, gc.BetDetailsNew, ...gc.defaultFeatures],
};
