import React from "react";

import { render } from "@testing-library/react";

import UserContext from "@/contexts/UserContext";

import Layout from "./Layout";

const USER_DATA_MOCK = {
    name: "Test",
    username: "test777",
    email: "test@example.com"
}

describe("@/domain/Dashboard/Layout", () => {
    it("should renders correctly", () => {
	const { queryByText } = render(
	    <UserContext.Provider value={USER_DATA_MOCK}>
		<Layout>
		    <span>I'm a children</span>
		</Layout>
	    </UserContext.Provider>
	);

	expect(queryByText("I'm a children")).toBeInTheDocument();
	expect(queryByText("Test")).toBeInTheDocument();
    });
});
