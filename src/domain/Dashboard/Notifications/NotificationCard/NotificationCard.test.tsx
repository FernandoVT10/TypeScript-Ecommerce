import React from "react";

import { fireEvent, render } from "@testing-library/react";

import NotificationCard from "./NotificationCard";

const NOTIFICATION_MOCK = {
    _id: "testid",
    from: "Testing Team",
    message: "This is a test",
    viewed: false,
    createdAt: new Date(Date.now()).toString()
}

describe("@/domain/Dashboard/Notifications/NotificationCard", () => {
    it("should renders correctly", () => {
	const { getByText } = render(
	    <NotificationCard notification={NOTIFICATION_MOCK} deleteNotification={jest.fn()}/>
	);

	expect(getByText("Testing Team")).toBeInTheDocument();
	expect(getByText("This is a test")).toBeInTheDocument();
	expect(getByText("a few seconds ago")).toBeInTheDocument();
    });

    it("should call deleteNotification with the notificationId", () => {
	const deleteNotificationMock = jest.fn();
	const { getByTestId } = render(
	    <NotificationCard notification={NOTIFICATION_MOCK} deleteNotification={deleteNotificationMock}/>
	);

	const button = getByTestId("delete-notification-button");
	fireEvent.click(button);
	
	expect(deleteNotificationMock).toHaveBeenCalledWith("testid");
    });
});
