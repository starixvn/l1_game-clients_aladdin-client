import { GameConfigs, IContainerOptions } from "@sg/game-client-base";
import { Container } from "inversify";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { settings } from "../../../mocks/game-settings";

const mockContainer = {
    id: "mock",
    parent: null,
    options: {},
    _middleware: [],
    bind: jest.fn().mockReturnValue({
        toConstantValue: jest.fn(),
        to: jest.fn()
    }),
    unbind: jest.fn(),
    isBound: jest.fn(),
    rebind: jest.fn(),
    unbindAll: jest.fn(),
    isBoundNamed: jest.fn(),
    get: jest.fn(),
    getTagged: jest.fn(),
    getNamed: jest.fn(),
    getAll: jest.fn(),
    getAllTagged: jest.fn(),
    getAllNamed: jest.fn(),
    resolve: jest.fn(),
} as unknown as Container;

export const containerOptions: IContainerOptions = {
    globalContainer: mockContainer,
    onContainerCreated: (container) => {
        container.bind(GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(LogStore).to(LogStore);
    },
    features: [],
    disabledFeatures: []
}; 