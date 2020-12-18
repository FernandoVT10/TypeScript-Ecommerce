import React from "react";

import { render } from "@testing-library/react";

import ShippingDetails from "./ShippingDetails";

const SHIPPING_DETAILS_MOCK = {
    address: {
	fullName: "Test Man",
	postalCode: "12345",
	state: "test state",
	municipality: "test municipality",
	suburb: "test suburb",
	street: "test street",
	outdoorNumber: "123",
	interiorNumber: "456",
	phoneNumber: "123-456-7890",
	additionalInformation: "test additional information"
    },
    shipping: {
	history: [
	    {
		content: "history #1",
		createdAt: new Date("16 dec 2020").toString()
	    },
	    {
		content: "history #2",
		createdAt: new Date("25 oct 2020").toString()
	    }
	]
    },
    isActive: true,
    setIsActive: jest.fn()
}

describe("@/domain/Dashboard/Orders/OrderCard/ShippingDetails", () => {
    it("should renders correctly", () => {
        const { queryByText } = render(
            <ShippingDetails {...SHIPPING_DETAILS_MOCK} />
        );

	expect(queryByText("Test Man")).toBeInTheDocument();
	expect(queryByText("test state test municipality (12345)")).toBeInTheDocument();
	expect(queryByText("test suburb test street #123(Interior: #456)")).toBeInTheDocument();
	expect(queryByText("123-456-7890")).toBeInTheDocument();
	expect(queryByText("test additional information")).toBeInTheDocument();

	expect(queryByText("history #1")).toBeInTheDocument();
	expect(queryByText("16 Dec")).toBeInTheDocument();

	expect(queryByText("history #2")).toBeInTheDocument();
	expect(queryByText("25 Oct")).toBeInTheDocument();
    });
});
