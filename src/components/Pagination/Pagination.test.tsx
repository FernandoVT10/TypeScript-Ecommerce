import React from "react";

import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";

import { fireEvent, render } from "@testing-library/react";

import Pagination, { PaginationProps } from "./Pagination";

const PAGINATION_MOCK: PaginationProps = {
    hasPrevPage: true,
    prevPage: 3,
    hasNextPage: false,
    nextPage: null,
    pages: [
        {
            active: false,
            pageNumber: 3
        },
        {
            active: false,
            pageNumber: 4
        },
        {
            active: true,
            pageNumber: 5
        }
    ]
}

describe("Pagination Component", () => {
    const mockedUseRouter = mocked(useRouter);

    beforeEach(() => {
        mockedUseRouter.mockClear();
    });

    it("should render correclty", async () => {
        const { queryByText, findAllByTestId } = render(<Pagination pagination={PAGINATION_MOCK}/>);

        expect(queryByText("3")).toBeInTheDocument();
        expect(queryByText("4")).toBeInTheDocument();
        expect(queryByText("5")).toBeInTheDocument();

        const buttons = await findAllByTestId("pagination-button") as HTMLButtonElement[];

        expect(buttons[0].disabled).toBeFalsy();
        expect(buttons[1].disabled).toBeTruthy();
    });

    it("should call router.push when we clicked on the page number or navigation button", async () => {
        const routerPushMock = jest.fn();

        const testRouter = useRouter();
        testRouter.push = routerPushMock;
        mockedUseRouter.mockImplementation(() => testRouter);

        const { findByText, findAllByTestId } = render(<Pagination pagination={PAGINATION_MOCK}/>);

        const number3 = await findByText("5");

        fireEvent.click(number3);

        expect(routerPushMock).toHaveBeenCalledWith({
            pathname: testRouter.pathname,
            query: { page: "5" }
        });

        const buttons = await findAllByTestId("pagination-button") as HTMLButtonElement[];

        fireEvent.click(buttons[0]);

        expect(routerPushMock).toHaveBeenCalledWith({
            pathname: testRouter.pathname,
            query: { page: "3" }
        });

        expect(routerPushMock).toHaveBeenCalledTimes(2);
    });
});