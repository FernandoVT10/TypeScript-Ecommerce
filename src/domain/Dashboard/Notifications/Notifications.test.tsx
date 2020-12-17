import React from "react";

import { mocked } from "ts-jest/utils";
import { render, act, fireEvent, screen } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import Notifications from "./Notifications";

jest.mock("@/services/ApiController");
jest.mock("@/components/Dashboard/Layout", () => ({ children }) => {
    return <div>{ children }</div>;
});

const NOTIFICATIONS_MOCK = [
    {
	_id: "id-1",
	from: "Testing Team 1",
	message: "This is a test 1",
	viewed: false,
	createdAt: new Date(Date.now()).toString()
    },
    {
	_id: "id-2",
	from: "Testing Team 2",
	message: "This is a test 2",
	viewed: false,
	createdAt: new Date(Date.now()).toString()
    }
];

const mockedAPIGet = mocked(ApiController.get);
const mockedAPIDelete = mocked(ApiController.delete);

describe("@/domain/Dashboard/Notifications", () => {
    beforeEach(() => {
	mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: { notifications: NOTIFICATIONS_MOCK }
	}));

	mockedAPIDelete.mockReset();
    });

    it("should call the api correclty", async () => {
	await act(async () => render(<Notifications/>));

	expect(mockedAPIGet).toHaveBeenCalledWith("account/notifications");
    });

    it("should render the notifications correctly", async () => {
	await act(async () => render(<Notifications/>));

	expect(screen.getByText("Testing Team 1")).toBeInTheDocument();
	expect(screen.getByText("Testing Team 2")).toBeInTheDocument();

	expect(screen.getByText("This is a test 1")).toBeInTheDocument();
	expect(screen.getByText("This is a test 2")).toBeInTheDocument();
    });

    it("should render message when there are no notifications", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: { notifications: [] }
	}));

	await act(async () => render(<Notifications/>));

	expect(screen.getByText("You don't have notifications")).toBeInTheDocument();
    });

    it("should call the api to delete a notification", async () => {
	mockedAPIDelete.mockImplementation(() => Promise.resolve({}));

	await act(async () => render(<Notifications/>));

	const buttons = screen.getAllByTestId("delete-notification-button");
	await act(async () => fireEvent.click(buttons[1]));

	expect(mockedAPIDelete).toHaveBeenCalledWith("account/notifications/id-2");
	expect(screen.queryByText("Test Team 2")).not.toBeInTheDocument();
    });
});
