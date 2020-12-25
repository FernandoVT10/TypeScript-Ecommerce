import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { mocked } from "ts-jest/utils";

import withJWTAuth from "../withJWTAuth";

import User from "../../../models/User";

setupTestDB("test_withJWTAuth_middleware");

jest.mock("jsonwebtoken");
jest.mock("../../../config", () => ({
    JWT_SECRET_KEY: "secret"
}))

const mockedJWTVerify = mocked(jwt.verify);

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: "secret",
    activeToken: "test token"
}

const REQ_MOCK = {
    headers: {
	authorization: "Bearer testtoken"
    },
    originalUrl: "/test/url/"
}

const RES_MOCK = {
    json: jest.fn() as Response["json"]
}

describe("With JWT Auth Middleware", () => {
    let userId = "";

    beforeEach(async () => {
	const user = await User.create(USER_MOCK);
	userId = user._id;

	mockedJWTVerify.mockReset();
	mockedJWTVerify.mockImplementation(() => ({ userId }));
    });

    it("should set the userId in the request and call jwt.verify correctly", async () => {
	const reqMock = { ...REQ_MOCK } as Request

	await withJWTAuth(reqMock, {} as Response, jest.fn());

	expect(mockedJWTVerify).toHaveBeenCalledWith("testtoken", "secret");
	expect(reqMock.userId).toBe(userId);
    });

    it("should get an error when the authorization header is undefined", async () => {
	const reqMock = {
	    ...REQ_MOCK,
	    headers: {}
	} as Request

	const resMock = { ...RES_MOCK } as Response;

	await withJWTAuth(reqMock, resMock, jest.fn());

	expect(resMock.json).toHaveBeenCalledWith({
	    status: 401,
	    error: "No authorization token",
	    message: "The authorization token is required",
	    path: "/test/url/"
	});
    });
});
