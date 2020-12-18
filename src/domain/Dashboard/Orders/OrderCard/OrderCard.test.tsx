import React from "react";

import { fireEvent, render } from "@testing-library/react";

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
    shipping: {
	arrivesIn: "5 days",
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

describe("@/domain/Dashboard/Orders/OrderCard", () => {
    it("should render correctly", () => {
	const { queryByText } = render(<OrderCard order={ORDER_MOCK}/>);

	expect(queryByText("$ 5 000.40")).toBeInTheDocument();
	expect(queryByText("5 days")).toBeInTheDocument();
	expect(queryByText("history #2")).toBeInTheDocument();
	expect(queryByText("Order Id: testid")).toBeInTheDocument();

	expect(queryByText("test title 1")).toBeInTheDocument();
	expect(queryByText("test title 2")).toBeInTheDocument();
    });

    it("should render correctly when the order.status is equal to 'COMPLETED'", () => {
	const order = {
	    ...ORDER_MOCK,
	    status: "COMPLETED" as Status
	}
	const { queryByText } = render(<OrderCard order={order}/>);

	expect(queryByText("See more shipping details")).not.toBeInTheDocument();
	expect(queryByText("5 days")).not.toBeInTheDocument();
	expect(queryByText("history #2")).not.toBeInTheDocument();
    });

    it("should activate the modal when we click on 'See more shipping details' button", () => {
	const { queryByText, getByText } = render(<OrderCard order={ORDER_MOCK}/>);

	expect(queryByText("Test Man")).not.toBeInTheDocument();

	const button = getByText("See more shipping details");
	fireEvent.click(button);

	expect(queryByText("Test Man")).toBeInTheDocument();
    });
});
