import type { Config } from "jest";

const defaultTestPaths = "tests";
const testMatch = (process.env.TEST_PATHS || defaultTestPaths)
    .split(",")
    .map((path) => `**/${path.replace("./", "")}/**/?(*.)+(spec|test).+(ts)`);
const config: Config = {
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["/node_modules/", "/container.test.ts"],
    testResultsProcessor: "jest-sonar-reporter",
    coverageReporters: ["cobertura", "text-summary", "text", "lcov"],
    setupFiles: ["<rootDir>/jest.setup.ts"],
    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "coverage",
            },
        ],
    ],
    testMatch,
    verbose: true,
};

export default config;
