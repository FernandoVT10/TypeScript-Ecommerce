import React from "react";

import { render, act, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ShoppingCartController from "@/services/ShoppingCartController";
import ApiController from "@/services/ApiController";

import BuyNow from "./BuyNow";

jest.mock("@/services/ShoppingCartController");
jest.mock("@/services/ApiController");
jest.mock("./BuyButton", () => ({
    paypalClientId, addressId
}: { paypalClientId: string, addressId: string }) => {
    return (
    	<div>
	    <span>PayPal Client Id: { paypalClientId } </span>
	    <span>Address Id: { addressId }</span>
    	</div>
    );
});

const mockedSCGetProductsFromServer = mocked(ShoppingCartController.getProductsFromServer);

const PRODUCTS_MOCK = [
    {
	title: "test title 1",
	images: ["test.jpg"],
	price: 550,
	discount: 0,
	quantity: 2
    },
    {
	title: "test title 2",
	images: ["test.jpg"],
	price: 200,
	discount: 50,
	quantity: 2
    }
];

const ADDRESSES_MOCK = [
    {
	_id: "id-1",
	fullName: "test full name 1",
	postalCode: "11111",
	phoneNumber: "111-111-1111",
	state: "test state 1",
	municipality: "test municipality 1",
	street: "test street 1",
	additionalInformation: "test additional information 1"
    }
];

const mockedAPIGet = mocked(ApiController.get);

describe("Domain BuyNow Component", () => {
    beforeEach(async () => {
        mockedSCGetProductsFromServer.mockReset();
	mockedSCGetProductsFromServer.mockImplementation(() => Promise.resolve(PRODUCTS_MOCK));

	mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({
	    data: {
		addresses: ADDRESSES_MOCK
	    }
	}));
    });

    it("should renders correctly", async () => {
	await act(async () => render(<BuyNow paypalClientId="" />));

	expect(screen.queryByText("test title 1")).toBeInTheDocument();
	expect(screen.queryByText("test title 2")).toBeInTheDocument();

	expect(screen.queryByText("$ 1 300")).toBeInTheDocument();

	expect(screen.queryByText("test state 1(11111), test municipality 1")).toBeInTheDocument();
    });

    it("should redirect to cart page if the shopping cart is empty", async () => {
	mockedSCGetProductsFromServer.mockImplementation(() => Promise.resolve([]));

	const routerPushMock = jest.fn();
	changeRouterProperties({
	    push: routerPushMock
	});

	await act(async () => render(<BuyNow paypalClientId="" />));
	expect(routerPushMock).toHaveBeenCalledWith("/cart/");
    });

    it("should display the buy button when we select an address", async () => {
	await act(async () => render(<BuyNow paypalClientId="test client id" />));

	const continueButton = screen.getByText("Continue");
	fireEvent.click(continueButton);

	expect(screen.queryByText("PayPal Client Id: test client id")).toBeInTheDocument();
	expect(screen.queryByText("Address Id: id-1")).toBeInTheDocument();
    });
});
