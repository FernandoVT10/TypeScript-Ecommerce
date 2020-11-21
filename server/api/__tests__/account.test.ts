import app from "../../app";
import supertest from "supertest";
import { mocked } from "ts-jest/utils";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import transporter from "../../utils/services/mail";

import User from "../../models/User";

const request = supertest(app);

setupTestDB("test_account_api");

jest.mock("../../utils/services/mail");
jest.mock("jsonwebtoken");

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: bcrypt.hashSync("secret", 10),
    activeToken: "test token"
}

const mockedSendMail = mocked(transporter.sendMail);
const mockedJWTSign = mocked(jwt.sign);

describe("Account API", () => {
    beforeEach(async () => {
	await User.createIndexes();
	await User.create(USER_MOCK);

	mockedSendMail.mockReset();
	mockedJWTSign.mockReset();
    });

    describe("Register", () => {
	it("should create an user and send an email correctly", async () => {
	    const res = await request.post("/api/account/register").send({
		name: "register",
		username: "register",
		email: "register@gmail.com",
		password: "register"
	    });

	    const user = await User.findOne({ username: "register" });
	    expect(user.email).toBe("register@gmail.com");

	    const sendMailCall = mockedSendMail.mock.calls[0];

	    expect(sendMailCall[0].to).toBe("register@gmail.com");
	    expect(sendMailCall[0].subject).toBe("Email Verification - TypeScriptEcomerce");

	    expect(res.body.data.message).toBe("You have successfully registered");
	});

	it("should return 'The username already exists' error", async () => {
	    const res = await request.post("/api/account/register").send({
		name: "register",
		username: "test777",
		email: "register@gmail.com",
		password: "register"
	    });

	    expect(res.body).toEqual({
		status: 400,
		error: "Validation Error",
		message: "The username already exists",
		path: "/api/account/register/"
	    });
	});

	it("should return 'The email already exists' error", async () => {
	    const res = await request.post("/api/account/register").send({
		name: "register",
		username: "register",
		email: "test@gmail.com",
		password: "register"
	    });

	    expect(res.body).toEqual({
		status: 400,
		error: "Validation Error",
		message: "The email already exists",
		path: "/api/account/register/"
	    });
	});
    });

    describe("Activate", () => {
	it("should activate an user", async () => {
	    const res = await request.get("/api/account/activate/test token");

	    const user = await User.findOne();
	    expect(user.active).toBeTruthy();

	    expect(res.body.data.message).toBe("Your account has been activated");
	});

	it("should return an sctivate token doesn't exist error", async () => {
	    const res = await request.get("/api/account/activate/test");

	    expect(res.body).toEqual({
		status: 404,
		error: "User not found",
		message: "The activation token don't exists",
		path: "/api/account/activate/test"
	    });
	});
    });

    describe("Login", () => {
	beforeEach(async () => {
	    await User.updateOne({}, { active: true });
	});

	it("should login and set the token cookie correctly", async () => {
	    mockedJWTSign.mockImplementation(() => "jwttoken321");

	    const res = await request.post("/api/account/login/").send({
	    	usernameOrEmail: "test@gmail.com",
		password: "secret"
	    });

	    expect(res.get("Set-Cookie")[0]).toMatch("jwttoken321");
	    expect(res.body.data.message).toBe("You have successfully logged in");
	});

	it("should login with the username too", async () => {
	    const res = await request.post("/api/account/login/").send({
	    	usernameOrEmail: "test777",
		password: "secret"
	    });

	    expect(res.body.data.message).toBe("You have successfully logged in");
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
});
