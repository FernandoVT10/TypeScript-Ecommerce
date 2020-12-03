import app from "../../../app";
import supertest from "supertest";
import { mocked } from "ts-jest/utils";

import jwt from "jsonwebtoken";

import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_isLogged_api");

jest.mock("jsonwebtoken");
jest.mock("../../../utils/services/mail", () => {});

jest.mock("../../../config", () => ({
    JWT_SECRET_KEY: "secret jwt"
}));

const mockedJWTVerify = mocked(jwt.verify);

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: "secret",
    activeToken: "test token",
    active: true
}

describe("Account IsLogged API", () => {
    let userId = "";
    
    beforeEach(async () => {
	const user = await User.create(USER_MOCK);

	userId = user._id;

	mockedJWTVerify.mockReset();
    });

    it("should call jwt.verify and return true", async () => {
	mockedJWTVerify.mockImplementation(() => ({ userId }));

	const res = await request.get("/api/account/isLogged").set("Authorization", "Bearer test token");

	expect(mockedJWTVerify).toHaveBeenCalledWith("test token", "secret jwt");

	expect(res.body.data.isLogged).toBeTruthy();
    });

    it("should return false when the user id is doesn't exists", async () => {
	mockedJWTVerify.mockImplementation(() => ({ userId: "qwertyqwertyqwer" }));

	const res = await request.get("/api/account/isLogged").set("Authorization", "Bearer test token");

	expect(mockedJWTVerify).toHaveBeenCalledWith("test token", "secret jwt");

	expect(res.body.data.isLogged).toBeFalsy();
    });
});
