import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, screen, act, render } from "@testing-library/react";

import UserContext from "@/contexts/UserContext";

import ApiController from "@/services/ApiController";

import EditForm from "./EditForm";

const mockedAPIPut = mocked(ApiController.put);

jest.mock("@/services/ApiController");

const USER_DATA_MOCK = {
    name: "Test",
    username: "test777",
    email: "test@example.com",
    permits: "USER" as any
}

const changeInputValue = (labelName: string, value: string) => {
    const input = screen.getByLabelText(labelName);
    fireEvent.change(input, { target: { value } });
}

describe("@/domain/Dashboard/EditProfile/EditForm", () => {
    it("should renders correctly", () => {
	const { getByLabelText } = render(
	    <UserContext.Provider value={USER_DATA_MOCK}>
		<EditForm/>
	    </UserContext.Provider>
	);

	const nameInput = getByLabelText("Name") as HTMLInputElement;
	expect(nameInput.value).toBe("Test");

	const usernameInput = getByLabelText("Username") as HTMLInputElement;
	expect(usernameInput.value).toBe("test777");

	const emailInput = getByLabelText("Email") as HTMLInputElement;
	expect(emailInput.value).toBe("test@example.com");
    });

    it("should display an error when the email is invalid", () => {
	const { getByText } = render(
	    <UserContext.Provider value={USER_DATA_MOCK}>
		<EditForm/>
	    </UserContext.Provider>
	);

	changeInputValue("Name", "test");
	changeInputValue("Username", "test777");
	changeInputValue("Email", "test@sdf");

	fireEvent.click(getByText("Save Changes"));

	expect(getByText("The email is invalid")).toBeInTheDocument();
    });

    describe("Api Call", () => {
	beforeEach(() => {
	    mockedAPIPut.mockReset();
	    mockedAPIPut.mockImplementation(() => Promise.resolve({
		data: { message: "success message" }
	    }));
	});

	it("should call the api correctly", async () => {
	    const { getByText } = render(
		<UserContext.Provider value={USER_DATA_MOCK}>
		    <EditForm/>
		</UserContext.Provider>
	    );

	    await act(async () => fireEvent.click(getByText("Save Changes")));

	    expect(mockedAPIPut).toHaveBeenCalledWith("account/edit", {
		body: {
		    name: "Test",
		    username: "test777",
		    email: "test@example.com"
		}
	    });
	});

	it("should display a success message", async () => {
	    const { getByText } = render(
		<UserContext.Provider value={USER_DATA_MOCK}>
		    <EditForm/>
		</UserContext.Provider>
	    );

	    await act(async () => fireEvent.click(getByText("Save Changes")));

	    expect(getByText("success message")).toBeInTheDocument();
	});

	it("should display an error message", async () => {
	    const { getByText } = render(
		<UserContext.Provider value={USER_DATA_MOCK}>
		    <EditForm/>
		</UserContext.Provider>
	    );

	    mockedAPIPut.mockImplementation(() => Promise.resolve({
		error: "error",
		message: "error message"
	    }));

	    await act(async () => fireEvent.click(getByText("Save Changes")));

	    expect(getByText("error message")).toBeInTheDocument();
	});
    });
});
