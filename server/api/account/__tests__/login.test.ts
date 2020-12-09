import app from "../../../app";
import supertest from "supertest";
import { mocked } from "ts-jest/utils";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_login_api");

jest.mock("jsonwebtoken");

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: bcrypt.hashSync("secret", 10),
    activeToken: "test token",
    active: true
}

const mockedJWTSign = mocked(jwt.sign);

describe("Account Login API", () => {
    beforeEach(async () => {
	await User.create(USER_MOCK);

	mockedJWTSign.mockReset();

	mockedJWTSign.mockImplementation(() => "jwttoken321");
    });

    it("should return the token correctly", async () => {
	const res = await request.post("/api/account/login/").send({
	    usernameOrEmail: "test@gmail.com",
	    password: "secret"
	});

	expect(res.body.data.token).toBe("jwttoken321");
    });

    it("should login with the username too", async () => {
	const res = await request.post("/api/account/login/").send({
	    usernameOrEmail: "test777",
	    password: "secret"
	});

	expect(res.body.data.token).toBe("jwttoken321");
    });

    it("should return an 'email or username doesn't exists' error", async () => {
	const res = await request.post("/api/account/login/").send({
	    usernameOrEmail: "test",
	    password: "secret"
	});

	expect(res.body).toEqual({
	    status: 404,
	    error: "User not found",
	    message: "The email or username don't exists",
	    path: "/api/account/login/"
	});
    });

    it("should return a 'this account is not active' error", async () => {
	await User.updateOne({}, { active: false });

	const res = await request.post("/api/account/login/").send({
	    usernameOrEmail: "test777",
	    password: "secret"
	});

	expect(res.body).toEqual({
	    status: 400,
	    error: "User not activated",
	    message: "This account has not been activated",
	    path: "/api/account/login/"
	});
    });

    it("should return a 'password is incorrect' error", async () => {
	const res = await request.post("/api/account/login/").send({
	    usernameOrEmail: "test777",
	    password: "secrel"
	});

	expect(res.body).toEqual({
	    status: 400,
	    error: "Validation Error",
	    message: "The password is incorrect",
	    path: "/api/account/login/"
	});
    });
});
