import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, screen, act, render } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import ChangePasswordForm from "./ChangePasswordForm";

const mockedAPIPut = mocked(ApiController.put);

jest.mock("@/services/ApiController");

const changeInputValue = (labelName: string, value: string) => {
    const input = screen.getByLabelText(labelName);
    fireEvent.change(input, { target: { value } });
}

const setDefaultInputValues = () => {
    changeInputValue("Current Password", "currentsecret");
    changeInputValue("New Password", "secret");
    changeInputValue("Repeat Password", "secret");
}

describe("@/domain/Dashboard/EditProfile/ChangePasswordForm", () => {
    it("should display an error when the current password length is less than 4", () => {
	const { getByText } = render(<ChangePasswordForm/>);

	changeInputValue("Current Password", "pas");
	changeInputValue("New Password", "secret");
	changeInputValue("Repeat Password", "secret");
	fireEvent.click(getByText("Change Password"));

	expect(getByText("The password is incorrect")).toBeInTheDocument();
    });

    it("should display an error when the new password length is less than 4", () => {
	const { getByText } = render(<ChangePasswordForm/>);

	changeInputValue("Current Password", "secret");
	changeInputValue("New Password", "pas");
	changeInputValue("Repeat Password", "secret");
	fireEvent.click(getByText("Change Password"));

	expect(getByText("The password must contain 4 or more characters")).toBeInTheDocument();
    });

    it("should display an error when the passwords doesn't match", () => {
	const { getByText } = render(<ChangePasswordForm/>);

	changeInputValue("Current Password", "secret");
	changeInputValue("New Password", "secret");
	changeInputValue("Repeat Password", "secret2");
	fireEvent.click(getByText("Change Password"));

	expect(getByText("The passwords doesn't match")).toBeInTheDocument();
    });

    describe("Api Call", () => {
	beforeEach(() => {
	    mockedAPIPut.mockReset();
	    mockedAPIPut.mockImplementation(() => Promise.resolve({
		data: { message: "success message" }
	    }));
	});

	it("should call the api correctly", async () => {
	    const { getByText } = render(<ChangePasswordForm/>);

	    setDefaultInputValues();
	    await act(async () => fireEvent.click(getByText("Change Password")));

	    expect(mockedAPIPut).toHaveBeenCalledWith("account/changePassword", {
		body: {
		    currentPassword: "currentsecret",
		    newPassword: "secret"
		}
	    });
	});

	it("should display a success message", async () => {
	    const { getByText } = render(<ChangePasswordForm/>);

	    setDefaultInputValues();
	    await act(async () => fireEvent.click(getByText("Change Password")));

	    expect(getByText("success message")).toBeInTheDocument();
	});

	it("should display an error message", async () => {
	    const { getByText } = render(<ChangePasswordForm/>);

	    setDefaultInputValues();

	    mockedAPIPut.mockImplementation(() => Promise.resolve({
		error: "error",
		message: "error message"
	    }));

	    await act(async () => fireEvent.click(getByText("Change Password")));

	    expect(getByText("error message")).toBeInTheDocument();
	});
    });
});
