import React from "react";

import { fireEvent, queryByAltText, render } from "@testing-library/react";

import OrderCard from "./OrderCard";

type Status = "SHIPPING" | "COMPLETED";

const ORDER_MOCK = {
    _id: "testid",
    total: 5000.50,
    status: "SHIPPING" as Status,
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
    user: {
	_id: "userid",
	username: "Test123"
    },
    shipping: {
	arrivesIn: "5 days",
	history: [
	    {
		content: "history #1",
		createdAt: "16 dec 2020"
	    },
	    {
		content: "history #2",
		createdAt: new Date("25 oct 2020").toString()
	    }
	]
    },
    products: [
	{
	    discount: 50,
	    price: 5000.40,
	    quantity: 2,
	    originalProduct: {
		_id: "id-1",
		title: "test title 1",
		images: ["test-1.jpg"]
	    }
	},
	{
	    discount: 0,
	    price: 0.5,
	    quantity: 2,
	    originalProduct: {
		_id: "id-2",
		title: "test title 2",
		images: ["test-2.jpg"]
	    }
	}
    ]
}

describe("@/components/Dashboard/OrderCard", () => {
    it("should render correctly", () => {
	const { queryByText, getByText } = render(<OrderCard order={ORDER_MOCK} isManageCard={true}/>);

	expect(queryByText("$ 5 000.40")).toBeInTheDocument();
	expect(queryByText("5 days")).not.toBeInTheDocument();
	expect(queryByText("Test123")).toBeInTheDocument();

	expect(queryByText("history #2")).toBeInTheDocument();

	expect(queryByText("Order Id: testid")).toBeInTheDocument();

	expect(queryByText("test title 1")).toBeInTheDocument();
	expect(queryByText("test title 2")).toBeInTheDocument();

	expect(queryByText("See more shipping details")).toBeInTheDocument();
    });

    it("should render when the order.status is equal to 'COMPLETED' and isManageCard be false", () => {
	const order = {
	    ...ORDER_MOCK,
	    status: "COMPLETED" as Status
	}
	const { queryByText } = render(<OrderCard order={order} isManageCard={false}/>);

	expect(queryByText("See more shipping details")).not.toBeInTheDocument();
	expect(queryByText("Send a message")).not.toBeInTheDocument();

	expect(queryByText("5 days")).not.toBeInTheDocument();
	expect(queryByText("Test123")).not.toBeInTheDocument();
    });

    it("should activate the modal when we click on 'See more shipping details' button", () => {
	const { queryByText, getByText, queryAllByText } = render(<OrderCard order={ORDER_MOCK}/>);

	expect(queryByText("Test Man")).not.toBeInTheDocument();

	fireEvent.click(getByText("See more shipping details"));

	expect(queryByText("Test Man")).toBeInTheDocument();

	expect(queryByText("history #1")).toBeInTheDocument();
	expect(queryByText("16 Dec")).toBeInTheDocument();

	expect(queryAllByText("history #2")).toHaveLength(2);
	expect(queryByText("25 Oct")).toBeInTheDocument();
    });
});
