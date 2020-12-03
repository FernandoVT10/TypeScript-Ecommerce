import fetch, { Response } from "node-fetch";

import { mocked } from "ts-jest/utils";

import apiCall from "../apiCall";

jest.mock("node-fetch");
jest.mock("../../../../config", () => ({
    PAYPAL_CLIENT_ID: "client",
    PAYPAL_CLIENT_SECRET: "secret"
}));

const AUTHOIZATION_MOCK = Buffer.from("client:secret").toString("base64");

const mockedFetch = mocked(fetch);

describe("Paypal Api Call service", () => {
    beforeEach(() => {
        mockedFetch.mockReset();

	const fetchResponse = {
	    json: () => Promise.resolve({ data: "test" })
	} as Response;

	mockedFetch.mockImplementation(() => Promise.resolve(fetchResponse));
    });

    it("should call the fetch and return the data correctly", async () => {
	const res = await apiCall("/this/is/a/test/", { test: ":)" });
	expect(res.data).toBe("test");

	expect(mockedFetch).toHaveBeenCalledWith(
	    "https://api.sandbox.paypal.com/this/is/a/test/",
	    {
		method: "POST",
		headers: {
		    "Content-Type": "application/json",
		    "Authorization": `Basic ${AUTHOIZATION_MOCK}`
		},
		body: JSON.stringify({ test: ":)" })
	    }
	);
    });
});
