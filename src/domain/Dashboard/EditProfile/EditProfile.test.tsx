import React from "react";

import { render } from "@testing-library/react";

import UserContext from "@/contexts/UserContext";

import EditProfile from "./EditProfile";

const USER_DATA_MOCK = {
    name: "Test",
    username: "test777",
    email: "test@example.com"
}

describe("@/domain/Dashboard/EditProfile", () => {
    it("should renders correctly", () => {
	render(
	    <UserContext.Provider value={USER_DATA_MOCK}>
		<EditProfile/>
	    </UserContext.Provider>
	);
    });
});
