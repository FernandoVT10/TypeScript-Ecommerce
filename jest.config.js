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
                "^.+\\.(css|less|scss)$": "identity-obj-proxy"
            }
        },
        {
            roots: ["<rootDir>/server"],
            displayName: "server",
            testEnvironment: "node",
            preset: "ts-jest",
            transform: {
                "^.+\\.tsx?$": "ts-jest"
            },
            testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$"
        }
    ]
};
