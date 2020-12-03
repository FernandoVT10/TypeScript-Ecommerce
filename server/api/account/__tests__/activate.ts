import app from "../../../app";
import supertest from "supertest";

import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_activate_api");

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: "secret",
    activeToken: "test token"
}

describe("Account Activate API", () => {
    beforeEach(async () => {
	await User.create(USER_MOCK);
    });

    it("should activate an user", async () => {
	const res = await request.post("/api/account/activate/test token");

	const user = await User.findOne();
	expect(user.active).toBeTruthy();

	expect(res.body.data.message).toBe("Your account has been activated");
    });

    it("should return an sctivate token doesn't exist error", async () => {
	const res = await request.post("/api/account/activate/test");

	expect(res.body).toEqual({
	    status: 404,
	    error: "User not found",
	    message: "The activation token doesn't exists",
	    path: "/api/account/activate/test"
	});
    });
});
