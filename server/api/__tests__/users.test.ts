import app from "../../app";
import supertest from "supertest";

const request = supertest(app);

describe("Users API", () => {
    it("should add 4", async () => {
        const res = await request.get("/api/users/getAllUsers");

        expect(res.body).toEqual({
            username: "Test"
        });
    });
});