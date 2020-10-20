import fetchMock from "jest-fetch-mock";

import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
    useRouter: jest.fn(() => {
        return {
            query: {},
            push: jest.fn()
        }
    })
}));

fetchMock.enableMocks();