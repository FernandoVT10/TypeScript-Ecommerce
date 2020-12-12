import app from "../../../app";
import supertest from "supertest";

const request = supertest(app);

setupTestDB("test_account_getUserData_api");
mockAuthentication();

describe("api/account/getUserData", () => {
    it("should return the user data correcty", async () => {
	const res = await request.get("/api/account/getUserData").set("Authorization", "Bearer token");

	expect(res.body.data.user).toEqual({
	    name: "test",
	    username: "test777",
	    email: "test@gmail.com"
	});
    });
});
