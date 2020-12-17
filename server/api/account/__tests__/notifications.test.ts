import app from "../../../app";
import supertest from "supertest";

import Notification from "../../../models/Notification";
import User from "../../../models/User";

const request = supertest(app);

setupTestDB("test_account_notfications_api");
mockAuthentication();

describe("api/account/notifications", () => {
    beforeEach(async () => {
	const user = await User.findOne();

        await Notification.insertMany([
	    {
		from: "Test Team 1",
		message: "This is a test 1",
		userId: user._id
	    },
	    {
		from: "Test Team 2",
		message: "This is a test 2",
		userId: user._id
	    }
	]);
    });

    describe("Get Notifications", () => {
	it("should return all notifications", async () => {
	    const res = await request.get("/api/account/notifications/").set("Authorization", "Bearer Token");

	    expect(res.body.data.notifications).toHaveLength(2);
	});

	it("should change the viewed parameter to true", async () => {
	    await request.get("/api/account/notifications/").set("Authorization", "Bearer Token");

	    const notifications = await Notification.find();
	    expect(notifications[0].viewed).toBeTruthy();
	    expect(notifications[1].viewed).toBeTruthy();
	});
    });

    describe("Delete Notification", () => {
	let notificationId = "";

	beforeEach(async () => {
	    const notification = await Notification.findOne({ from: "Test Team 1" });
	    notificationId = notification._id;
	});

	it("should delete a notification correctly", async () => {
	    const res = await request
		.delete(`/api/account/notifications/${notificationId}`)
		.set("Authorization", "Bearer Token");

	    const { deletedNotification } = res.body.data;
	    expect(deletedNotification.from).toBe("Test Team 1");

	    expect(await Notification.exists({ _id: notificationId })).toBeFalsy();
	});

	it("should return an error when the notification doesn't exists", async () => {
	    const res = await request
		.delete(`/api/account/notifications/abcdefabcdefabcdefabcdef`)
		.set("Authorization", "Bearer Token");

	    expect(res.body).toEqual({
	    	status: 404,
		error: "Not found",
		message: "The notification doesn't exists",
		path: "/api/account/notifications/abcdefabcdefabcdefabcdef"
	    });
	});
    });
});
