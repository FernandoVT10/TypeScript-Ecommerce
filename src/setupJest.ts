import fetchMock from "jest-fetch-mock";

import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";

import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => {
        return {
            query: {},
            push: jest.fn()
        }
    })
}));

const mockedUseRouter = mocked(useRouter);

function changeRouterProperties(options = {}) {
    const testRouter = useRouter();

    Object.assign(testRouter, options);
    
    mockedUseRouter.mockImplementation(() => testRouter);
}

fetchMock.enableMocks();

global.changeRouterProperties = changeRouterProperties;