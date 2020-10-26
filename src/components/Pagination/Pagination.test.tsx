import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Pagination from "./Pagination";

const PAGINATION_MOCK = {
    totalPages: 10,
    hasPrevPage: true,
    prevPage: 3,
    hasNextPage: false,
    nextPage: null,
    page: 5
}

describe("Pagination Component", () => {
    it("should render correclty", async () => {
        const { queryByText, findAllByTestId } = render(<Pagination pagination={PAGINATION_MOCK}/>);
        expect(queryByText("3")).toBeInTheDocument();
        expect(queryByText("4")).toBeInTheDocument();
        expect(queryByText("5")).toBeInTheDocument();

        const buttons = await findAllByTestId("pagination-button") as HTMLButtonElement[];

        expect(buttons[0].disabled).toBeFalsy();
        expect(buttons[1].disabled).toBeTruthy();
    });

    it("should call router.push when we clicked on the page number", async () => {
        const routerPushMock = jest.fn();

        changeRouterProperties({ push: routerPushMock, pathname: "/" });

        const { findByText } = render(<Pagination pagination={PAGINATION_MOCK}/>);

        const number3 = await findByText("5");

        fireEvent.click(number3);

        expect(routerPushMock).toHaveBeenCalledWith({
            pathname: "/",
            query: { page: "5" }
        });
    });

    it("should call router.push when we clicked on the navigation button", async () => {
        const routerPushMock = jest.fn();

        changeRouterProperties({ push: routerPushMock, pathname: "/" });

        const { findAllByTestId } = render(<Pagination pagination={PAGINATION_MOCK}/>);

        const buttons = await findAllByTestId("pagination-button") as HTMLButtonElement[];

        fireEvent.click(buttons[0]);

        expect(routerPushMock).toHaveBeenCalledWith({
            pathname: "/",
            query: { page: "3" }
        });
    });
});
