import app from "../../app";
import supertest from "supertest";

import User, { IUser } from "../../models/User";

const request = supertest(app);

setupTestDB("test_users_api");
mockAuthentication();

const USERS_MOCK = [
    {
        name: "test name 1",
        username: "test username 1",
        email: "test1@example.com",
        password: "test password 1",
        permits: "USER"
    },
    {
        name: "test name 2",
        username: "test username 2",
        email: "test2@example.com",
        password: "test password 2",
        permits: "USER"
    },
    {
        name: "test name 3",
        username: "test username 3",
        email: "test3@example.com",
        password: "test password 3",
        permits: "USER"
    }
];

describe("/api/users", () => {
    beforeEach(async () => {
        await User.updateOne({}, { permits: "SUPERADMIN" });

        await User.insertMany(USERS_MOCK);
    });

    describe("get users", () => {
        it("should get all the users", async () => {
            const res = await request.get("/api/users").set("Authorization", "Bearer token");

            const { data } = res.body;
            expect(data.totalUsers).toBe(4);
            expect(data.limit).toBe(10);
            expect(data.page).toBe(1);
            expect(data.totalPages).toBe(1);

            const users = data.users as IUser[];

            expect(users[0].name).toBe("test");
            expect(users[0].username).toBe("test777");
            expect(users[0].email).toBe("test@gmail.com");

            USERS_MOCK.forEach((user, index) => {
                expect(user.name).toBe(users[index + 1].name);
                expect(user.username).toBe(users[index + 1].username);
                expect(user.email).toBe(users[index + 1].email);
            });
            
            expect(users).toHaveLength(4);
        });

        it("should get one user with the page and limit parameter", async () => {
            const res = await request
                .get("/api/users?limit=1&page=2")
                .set("Authorization", "Bearer token");

            const { data } = res.body;
            expect(data.totalUsers).toBe(4);
            expect(data.limit).toBe(1);
            expect(data.page).toBe(2);
            expect(data.totalPages).toBe(4);

            const users = data.users as IUser[];

            expect(users[0].name).toBe("test name 1");
            expect(users[0].username).toBe("test username 1");
            expect(users[0].email).toBe("test1@example.com");
        });

        it("should get one user with the search parameter", async () => {
            const res = await request
                .get("/api/users?search=test name 3")
                .set("Authorization", "Bearer token");

            const users = res.body.data.users as IUser[];

            expect(users[0].name).toBe("test name 3");
            expect(users[0].username).toBe("test username 3");
            expect(users[0].email).toBe("test3@example.com");
        });
    });

    describe("update user", () => {
        let userId = "";

        beforeEach(async () => {
            const user = await User.findOne({ username: "test username 3" });
            userId = user._id;
        });

        it("should change the permits", async () => {
            const res = await request
                .put(`/api/users/${userId}`)
                .send({ permits: "ADMIN" })
                .set("Authorization", "Bearer token");

            const updatedUser = await res.body.data.updatedUser as IUser;
            const user = await User.findById(updatedUser._id);

            expect(user.username).toBe(updatedUser.username);
            expect(user.email).toBe(updatedUser.email);
            expect(user.name).toBe(updatedUser.name);
            expect(user.permits).toBe("ADMIN");
        });

        it("should return an error when userId doesn't exist", async () => {
            const res = await request
                .put(`/api/users/abcdefabcdefabcdefabcdef`)
                .send({ permits: "ADMIN" })
                .set("Authorization", "Bearer token");

            expect(res.body).toEqual({
                status: 404,
                error: "Not found",
                message: "The user 'abcdefabcdefabcdefabcdef' doesn't exist",
                path: "/api/users/abcdefabcdefabcdefabcdef"
            });
        });
    });
});
