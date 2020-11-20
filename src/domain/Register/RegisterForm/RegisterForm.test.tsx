import React from "react";

import { fireEvent, render } from "@testing-library/react";

import RegisterForm from "./RegisterForm";

import { InputHadnlingResponse } from "@/hooks/useInputHandling";

const PROPS_MOCK = {
    handleForm: jest.fn(),
    nameHandler: {} as InputHadnlingResponse<string>,
    usernameHandler: {} as InputHadnlingResponse<string>,
    emailHandler: {} as InputHadnlingResponse<string>,
    passwordHandler: {} as InputHadnlingResponse<string>,
    repeatPasswordHandler: {} as InputHadnlingResponse<string>,
    termsAndConditionsHandler: {} as InputHadnlingResponse<boolean>,
    loading: false
}

describe("Domain Register Register Form Component", () => {
    it("should renders the value in the inputs correctly", async () => {
	const { queryByDisplayValue, findByRole } = render(
	    <RegisterForm
	    handleForm={jest.fn()}
	    nameHandler={{ value: "name test" } as InputHadnlingResponse<string>}
	    usernameHandler={{ value: "username test" } as InputHadnlingResponse<string>}
	    emailHandler={{ value: "email test" } as InputHadnlingResponse<string>}
	    passwordHandler={{ value: "password test" } as InputHadnlingResponse<string>}
	    repeatPasswordHandler={{ value: "repeat password test" } as InputHadnlingResponse<string>}
	    termsAndConditionsHandler={{ value: true } as InputHadnlingResponse<boolean>}
	    loading={false}/>
	);

	expect(queryByDisplayValue("name test")).toBeInTheDocument();
	expect(queryByDisplayValue("username test")).toBeInTheDocument();
	expect(queryByDisplayValue("email test")).toBeInTheDocument();
	expect(queryByDisplayValue("password test")).toBeInTheDocument();
	expect(queryByDisplayValue("repeat password test")).toBeInTheDocument();

	const checkbox = await findByRole("checkbox") as HTMLInputElement;
	expect(checkbox.checked).toBeTruthy();
    });

    it("should call handleForm", async () => {
	const handleFormMock = jest.fn(e => e.preventDefault());

	const registerFormProps = {
	    ...PROPS_MOCK,
	    handleForm: handleFormMock
	}

	const { findByRole } = render(
	    <RegisterForm { ...registerFormProps }/>
	);

	const submitButton = await findByRole("button");
	fireEvent.click(submitButton);

	expect(handleFormMock).toHaveBeenCalled();
    });


    it("should renders the loader correctly", () => {
	const registerFormProps = {
	    ...PROPS_MOCK,
	    loading: true
	}

	const { queryByTestId, queryByRole } = render(
	    <RegisterForm { ...registerFormProps }/>
	);

	expect(queryByTestId("register-form-loader")).toBeInTheDocument();
	expect(queryByRole("button")).not.toBeInTheDocument();
    });
});
