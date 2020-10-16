const path = require("path");

module.exports = {
    projects: [
        {
            roots: ["<rootDir>/src"],
            displayName: "dom",
            testEnvironment: "jsdom",
            preset: "ts-jest",
            transform: {
                "^.+\\.tsx?$": "ts-jest"
            },
            testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
            globals: {
                "ts-jest": {
                    tsConfig: "tsconfig.jest.json"
                }
            },
            moduleNameMapper: {
                "^.+\\.(css|less|scss)$": "identity-obj-proxy",
                "^@/(.*)$": path.join(__dirname, "src/$1"),
            },
            setupFilesAfterEnv: ["./src/setupJest.ts"],
        },
        {
            roots: ["<rootDir>/server"],
            displayName: "server",
            testEnvironment: "node",
            preset: "ts-jest",
            transform: {
                "^.+\\.tsx?$": "ts-jest"
            },
            testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$",
            setupFiles: ["./server/setupJest.ts"]
        }
    ]
};
