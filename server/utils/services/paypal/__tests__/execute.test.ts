import { mocked } from "ts-jest/utils";

import executeOrder from "../executeOrder";

import apiCall from "../apiCall";

jest.mock("../apiCall");

const mockedAPICall = mocked(apiCall);

describe("Paypal Execute Order service", () => {
    beforeEach(async () => {
	mockedAPICall.mockReset();
	mockedAPICall.mockImplementation(() => Promise.resolve({ status: "COMPLETED" }));
    });

    it("should call to apiCall and return true", async () => {
	expect(await executeOrder("testid")).toBeTruthy();

	expect(mockedAPICall).toHaveBeenCalledWith("/v2/checkout/orders/testid/capture");
    });

    it("should return false", async () => {
	mockedAPICall.mockImplementation(() => Promise.resolve({ status: "PENDING" }));
	expect(await executeOrder("testid")).toBeFalsy();
    });

    it("should throw an error", async () => {
	mockedAPICall.mockImplementation(() => Promise.reject(new Error("test message")));
	
	try {
	    await executeOrder("testid");
	} catch (err) {
	    expect(err.message).toBe("test message");
	}
    });
});
