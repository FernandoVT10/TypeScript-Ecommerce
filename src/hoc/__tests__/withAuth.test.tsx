import React, { useContext } from "react";
import { mocked } from "ts-jest/utils";

import Router from "next/router";

import { render, act, screen } from "@testing-library/react";

import UserContext from "@/contexts/UserContext";

import ApiController from "@/services/ApiController";

import withAuth from "../withAuth";

jest.mock("@/services/ApiController");

jest.mock("@/pages/login", () => () => {
    return (
    	<div>Login Page</div>
    );
});

const mockedAPIGet = mocked(ApiController.get);
const mockedRouter = mocked(Router);

const COMPONENT_MOCK = ({ text }: { text: string }) => {
    const user = useContext(UserContext);

    return (
	<div>
	    <span>Test component</span>
	    <span>{ text }</span>

	    <span>{ user.name }</span>
	    <span>{ user.username }</span>
	    <span>{ user.email }</span>
	</div>
    );
}

const USER_DATA_MOCK = {
    name: "Test",
    username: "test777",
    email: "test@example.com",
    permits: "USER"
}

const renderComponent = async () => {
    const Component = withAuth(COMPONENT_MOCK);
    await act(async () => render(<Component text="random text"/>));
}

describe("@/hoc/withAuth", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: { user: USER_DATA_MOCK }
	}));

	mockedRouter.replace = jest.fn();
    });

    it("should call the api correctly", async () => {
	await renderComponent();
	expect(mockedAPIGet).toHaveBeenCalledWith("account/getUserData");
    });

    it("should renders correctly", async () => {
	await renderComponent();

	expect(screen.queryByText("Test component")).toBeInTheDocument();
	expect(screen.queryByText("random text")).toBeInTheDocument();

	expect(screen.queryByText("Test")).toBeInTheDocument();
	expect(screen.queryByText("test777")).toBeInTheDocument();
	expect(screen.queryByText("test@example.com")).toBeInTheDocument();
    });

    it("should display the login page when the api response doesn't return the user data", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({}))
	await renderComponent();

	expect(screen.queryByText("Login Page")).toBeInTheDocument();
    });

    it("should call Router.replace when the user isn't logged in", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({}))
	await renderComponent();

	expect(Router.replace).toHaveBeenCalledWith("/login/")
    });

    it("should redirect when the user doesn't have enough permissions", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({}))

	const Component = withAuth(COMPONENT_MOCK, "SUPERADMIN");
	await act(async () => render(<Component text="random text"/>));

	expect(Router.replace).toHaveBeenCalledWith("/login/")
    });
});
