import app from "../../../app";
import supertest from "supertest";
import { mocked } from "ts-jest/utils";

import transporter from "../../../utils/services/mail";

import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_register_api");

jest.mock("../../../utils/services/mail");

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: "secret",
    activeToken: "test token"
}

const mockedSendMail = mocked(transporter.sendMail);

describe("Account Register API", () => {
    beforeEach(async () => {
	await User.createIndexes();
        await User.create(USER_MOCK);

	mockedSendMail.mockReset();
    });

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
