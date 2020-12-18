import React from "react";

import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import { PayPalButton } from "react-paypal-button-v2";

import ApiController from "@/services/ApiController";

import BuyButton from "./BuyButton";

jest.mock("react-paypal-button-v2");
jest.mock("@/services/ApiController");

const CART_ITEMS_MOCK = [
    {
	productId: "test 1",
	quantity: 5
    },
    {
	productId: "test 2",
	quantity: 5
    }
];

const mockedPayPalButton = mocked(PayPalButton);
const mockedAPIPost = mocked(ApiController.post);

const setLoadingMock = jest.fn();

describe("Domain BuyNow BuyButton Component", () => {
    beforeEach(() => {
	fetchMock.mockReset();
	mockedPayPalButton.mockReset();
	mockedAPIPost.mockReset();
	setLoadingMock.mockReset();

	window.localStorage.clear();
	window.localStorage.setItem("cart", JSON.stringify(CART_ITEMS_MOCK));
    });

    it("should renders correctly", () => {
	render(
	    <BuyButton
	    paypalClientId="testpaypal"
	    addressId="testaddress"
	    setErrorMessage={jest.fn()}
	    setLoading={jest.fn()}/>
	);

	const buttonCall = mockedPayPalButton.mock.calls[0][0];
	expect(buttonCall.options).toEqual({
	    clientId: "testpaypal"
	});
    });

    describe("Create Order", () => {
	it("should call the api and return the orderId", async () => {
	    mockedAPIPost.mockImplementation(() => Promise.resolve({ data: { orderId: "testid" } }));

	    render(
		<BuyButton
		paypalClientId="testpaypal"
		addressId="testaddress"
		setErrorMessage={jest.fn()}
		setLoading={setLoadingMock}/>
	    );

	    const buttonCall = mockedPayPalButton.mock.calls[0][0];

	    const res = await buttonCall.createOrder();
	    expect(res).toBe("testid");

	    expect(mockedAPIPost).toHaveBeenCalledWith("payment/create", {
		body: {
		    cartItems: CART_ITEMS_MOCK,
		    addressId: "testaddress"
		}
	    });

	    expect(setLoadingMock).toHaveBeenCalledWith(true);
	});       
    });

    describe("On Success", () => {
	it("should call the api correctly, clear the shopping cart and redirect to /dashboard/orders", async () => {
	    const routerPushMock = jest.fn();
	    changeRouterProperties({ push: routerPushMock });

	    mockedAPIPost.mockImplementation(() => Promise.resolve({}));

	    render(
		<BuyButton
		paypalClientId="testpaypal"
		addressId="testaddress"
		setErrorMessage={jest.fn()}
		setLoading={setLoadingMock}/>
	    );

	    const buttonCall = mockedPayPalButton.mock.calls[0][0];
	    await buttonCall.onSuccess(null, { orderID: "testid" });

	    expect(mockedAPIPost).toHaveBeenCalledWith("payment/execute", {
		body: {
		    orderId: "testid"
		}
	    });

	    expect(window.localStorage.getItem("cart")).toBe("[]");
	    expect(routerPushMock).toHaveBeenCalledWith("/dashboard/orders");
	    expect(setLoadingMock).toHaveBeenCalledWith(false);
	});

	it("should call setErrorMessage when the api returns an error", async () => {
	    const setErrorMessageMock = jest.fn();
	    mockedAPIPost.mockImplementation(() => Promise.resolve({
		error: "Test",
		message: "This is an error message"
	    }));

	    render(
		<BuyButton
		paypalClientId="testpaypal"
		addressId="testaddress"
		setErrorMessage={setErrorMessageMock}
		setLoading={setLoadingMock}/>
	    );

	    const buttonCall = mockedPayPalButton.mock.calls[0][0];
	    await buttonCall.onSuccess(null, { orderID: "testid" });

	    expect(setErrorMessageMock).toHaveBeenCalledWith("This is an error message");
	    expect(setLoadingMock).toHaveBeenCalledWith(false);
	});
    });

    describe("On Cancel", () => {
	it("should call the api correctly", async () => {
	    mockedAPIPost.mockImplementation(() => Promise.resolve({}));

	    render(
		<BuyButton
		paypalClientId="testpaypal"
		addressId="testaddress"
		setErrorMessage={jest.fn()}
		setLoading={setLoadingMock}/>
	    );

	    const buttonCall = mockedPayPalButton.mock.calls[0][0];
	    await buttonCall.onCancel({ orderID: "testid" });

	    expect(mockedAPIPost).toHaveBeenCalledWith("payment/cancel", {
		body: {
		    orderId: "testid"
		}
	    });

	    expect(setLoadingMock).toHaveBeenCalledWith(false);
	});
    });

    describe("On Error", () => {
	it("should call the api to cancel the order and call setErrorMessage", async () => {
	    const setErrorMessageMock = jest.fn();
	    mockedAPIPost.mockImplementation(() => Promise.resolve({}));

	    render(
		<BuyButton
		paypalClientId="testpaypal"
		addressId="testaddress"
		setErrorMessage={setErrorMessageMock}
		setLoading={setLoadingMock}/>
	    );

	    const buttonCall = mockedPayPalButton.mock.calls[0][0];
	    await buttonCall.onError({ orderID: "testid" });

	    expect(mockedAPIPost).toHaveBeenCalledWith("payment/cancel", {
		body: {
		    orderId: "testid"
		}
	    });
	    expect(setErrorMessageMock).toHaveBeenCalledWith("An error has ocurred in the server. Please try again later.");
	    expect(setLoadingMock).toHaveBeenCalledWith(false);
	});       
    });
});
