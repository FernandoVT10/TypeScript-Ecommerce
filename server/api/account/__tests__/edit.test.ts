import app from "../../../app";
import supertest from "supertest";

import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_edit_api");
mockAuthentication();

describe("api/account/edit", () => {
    it("should edit a user correcty", async () => {
	const res = await request.put("/api/account/edit")
	    .send({
	    	name: "edited name",
		username: "edited username",
		email: "test@edited.com"
	    })
	    .set("Authorization", "Bearer token");

	const user = await User.findOne();

	expect(user.name).toBe("edited name");
	expect(user.username).toBe("edited username");
	expect(user.email).toBe("test@edited.com");

	expect(res.body.data.message).toBe("The account has been edited successfully");
    });

    it("should return an error when the values are invalid", async () => {
	const res = await request.put("/api/account/edit")
	    .send({
	    	name: "edited name",
		username: "edited username",
		email: "test@invalid"
	    })
	    .set("Authorization", "Bearer token");

	expect(res.body).toMatchSnapshot();
    });
});
