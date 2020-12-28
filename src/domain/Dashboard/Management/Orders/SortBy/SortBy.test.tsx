import React from "react";

import { fireEvent, render } from "@testing-library/react";

import SortBy from "./SortBy";

describe("@/domain/Dashboard/Management/Orders/SortBy", () => {
    beforeEach(() => {
        changeRouterProperties({
            query: ""
        });
    });

    it("should render with query parameters correclty", () => {
	changeRouterProperties({
	    query: {
		orderId: "testid",
		only: "COMPLETED"
	    }
	});

	const { getByLabelText, getByTestId } = render(<SortBy/>);

	const input = getByTestId("sortBy-search-input") as HTMLInputElement;
	expect(input.value).toBe("testid");

	const completedCheckbox = getByLabelText("Completed") as HTMLInputElement;
	expect(completedCheckbox.checked).toBeTruthy();

	const shippingCheckbox = getByLabelText("Shipping") as HTMLInputElement;
	expect(shippingCheckbox.checked).toBeFalsy();
    });

    it("should call router.push with the orderId query parameter", () => {
	const routerPushMock = jest.fn();
	changeRouterProperties({
	    push: routerPushMock,
	    pathname: "/"
	});

	const { getByText, getByTestId } = render(<SortBy/>);

	const input = getByTestId("sortBy-search-input") as HTMLInputElement;
	fireEvent.change(input, { target: { value: "changed input" } });

	fireEvent.click(getByText("Apply Filters"));

	expect(routerPushMock).toHaveBeenCalledWith({
	    pathname: "/",
	    query: {
		orderId: "changed input"
	    }
	});
    });

    it("should call router.push with the only query parameter", () => {
	const routerPushMock = jest.fn();
	changeRouterProperties({
	    push: routerPushMock,
	    pathname: "/"
	});

	const { getByText, getByLabelText } = render(<SortBy/>);

	fireEvent.click(getByLabelText("Shipping"));
	fireEvent.click(getByText("Apply Filters"));

	expect(routerPushMock).toHaveBeenCalledWith({
	    pathname: "/",
	    query: {
		only: "COMPLETED"
	    }
	});
    });

    it("should call router.push without the only query parameter when we uncheck the 2 checkboxes", () => {
	const routerPushMock = jest.fn();
	changeRouterProperties({
	    push: routerPushMock,
	    pathname: "/"
	});

	const { getByText, getByLabelText } = render(<SortBy/>);

	fireEvent.click(getByLabelText("Shipping"));
	fireEvent.click(getByLabelText("Completed"));
	fireEvent.click(getByText("Apply Filters"));

	expect(routerPushMock).toHaveBeenCalledWith({
	    pathname: "/",
	    query: {}
	});
    });

    it("should call router.push with the only and orderId query parameter", () => {
	const routerPushMock = jest.fn();
	changeRouterProperties({
	    push: routerPushMock,
	    pathname: "/"
	});

	const { getByText, getByTestId, getByLabelText } = render(<SortBy/>);

	const input = getByTestId("sortBy-search-input") as HTMLInputElement;
	fireEvent.change(input, { target: { value: "testid" } });

	fireEvent.click(getByLabelText("Completed"));
	fireEvent.click(getByText("Apply Filters"));

	expect(routerPushMock).toHaveBeenCalledWith({
	    pathname: "/",
	    query: {
		only: "SHIPPING",
		orderId: "testid"
	    }
	});
    });
});
