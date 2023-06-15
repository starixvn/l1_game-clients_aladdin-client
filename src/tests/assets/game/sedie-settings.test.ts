import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { GameConfigs } from "game-client-base";
import { containerOptions, settings } from "../../../assets/game/scripts/sedie-settings";

jest.mock("db://shared-components/shared/scripts/startup", () => ({
    getSharedContainer: jest.fn(() => ({ sharedContainer: true })),
}));

describe("settings", () => {
    it("should have data as expected", () => {
        // Assert
        expect(settings).toStrictEqual({
            id: 2,
            name: "SeDie",
            durations: {
                wholeRound: 39,
                lockingBet: 5,
                placingBet: 30,
                generatingResult: 2,
                startRound: 1,
            },
            numberOfRoundHistory: 100,
        });
    });
});

describe("when container created", () => {
    let container;
    let bind: jest.Mock;
    let toConstantValue: jest.Mock;
    let to: jest.Mock;

    beforeEach(() => {
        toConstantValue = jest.fn();
        to = jest.fn();
        bind = jest.fn().mockImplementation(() => ({ toConstantValue, to }));

        container = { bind };
    });

    it("should bind GameSetting", () => {
        // Act
        containerOptions.onContainerCreated(container);

        // Assert
        expect(bind).toBeCalledWith(GameConfigs.GameSetting);
        expect(toConstantValue).toBeCalledWith(settings);
    });

    it("should bind LogStore", () => {
        // Act
        containerOptions.onContainerCreated(container);

        // Assert
        expect(bind).toBeCalledWith(LogStore);
        expect(to).toBeCalledWith(LogStore);
    });
});
