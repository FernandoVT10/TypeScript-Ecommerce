import app from "../../../app";
import supertest from "supertest";

import bcrypt from "bcrypt";

import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_changePassword_api");
mockAuthentication();

describe("api/account/changePassword", () => {
    beforeEach(async () => {
        const user = await User.findOne();

	user.password = bcrypt.hashSync("secret", 10);

	await user.save();
    });

    it("should change the password correctly", async () => {
	const res = await request.put("/api/account/changePassword")
	    .send({
		currentPassword: "secret",
		newPassword: "test"
	    })
	    .set("Authorization", "Bearer token");

	const user = await User.findOne();

	expect(bcrypt.compareSync("test", user.password)).toBeTruthy();

	expect(res.body.data.message).toBe("The password has been changed successfully");
    });

    it("should return an error when the newPassword length is less than 4", async () => {
	const res = await request.put("/api/account/changePassword")
	    .send({
		currentPassword: "secret",
		newPassword: "pas"
	    })
	    .set("Authorization", "Bearer token");

	expect(res.body).toEqual({
	    status: 400,
	    error: "Validation Error",
	    message: "The password must contain 4 or more characters",
	    path: "/api/account/changePassword"
	});
    });

    it("should return an error when the currentPassword is incorrect", async () => {
	const res = await request.put("/api/account/changePassword")
	    .send({
		currentPassword: "wrong",
		newPassword: "passsword"
	    })
	    .set("Authorization", "Bearer token");

	expect(res.body).toEqual({
	    status: 400,
	    error: "Validation Error",
	    message: "The password is incorrect",
	    path: "/api/account/changePassword"
	});
    });
});
