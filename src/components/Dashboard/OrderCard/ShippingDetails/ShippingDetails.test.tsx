import React from "react";

import { fireEvent, render, act } from "@testing-library/react";

import ShippingDetails from "./ShippingDetails";

const SHIPPING_DETAILS_MOCK = {
    orderId: "testid",
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
    setIsActive: jest.fn(),
    isManageCard: true
}

describe("@/components/Dashboard/OrderCard/ShippingDetails", () => {
    beforeEach(() => {
        fetchMock.mockReset();
	fetchMock.mockResponse(JSON.stringify({}));
    });

    it("should render correctly", () => {
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

	expect(queryByText("Add New Status")).toBeInTheDocument();
    });

    it("shouldn't render 'AddShippingStatus' when the isManageCard be false", () => {
	const shippingDetailsProps = {
	    ...SHIPPING_DETAILS_MOCK,
	    isManageCard: false
	}

        const { queryByText } = render(
            <ShippingDetails {...shippingDetailsProps} />
        );

	expect(queryByText("Add New Status")).not.toBeInTheDocument();
    });

    it("should add a new status", async () => {
        const { queryByText, getByText, getByLabelText } = render(
            <ShippingDetails {...SHIPPING_DETAILS_MOCK} />
        );

	fireEvent.click(getByText("Add New Status"));

	const input = getByLabelText("New Status");
	fireEvent.change(input, { target: { value: "test status" } });

	await act(async () => fireEvent.click(getByText("Add Status")));

	expect(queryByText("history #1")).toBeInTheDocument();
	expect(queryByText("16 Dec")).toBeInTheDocument();

	expect(queryByText("history #2")).toBeInTheDocument();
	expect(queryByText("25 Oct")).toBeInTheDocument();

	expect(queryByText("test status")).toBeInTheDocument();
    });

    it("should call setIsActive when we close the modal", () => {
	const setIsActiveMock = jest.fn();

	const shippingDetailsProps = {
	    ...SHIPPING_DETAILS_MOCK,
	    setIsActive: setIsActiveMock
	}

        const { getByTestId } = render(
            <ShippingDetails {...shippingDetailsProps} />
        );

	fireEvent.click(getByTestId("close-modal-button"));

	expect(setIsActiveMock).toHaveBeenCalledWith(false);
    });
});
