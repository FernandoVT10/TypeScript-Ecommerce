import React from "react";

import { useRouter } from "next/router";
import { mocked } from "ts-jest/utils";

import { render, fireEvent } from "@testing-library/react";

import SearchDetails, { Category } from "./SearchDetails";

const CATEGORIES_MOCK: Category[] = [
    {
        _id: "test-category-1",
        name: "Gamer"
    },
    {
        _id: "test-category-2",
        name: "Accesories"
    }
];

describe("Domain Products Search Details", () => {
    const mockedUseRouter = mocked(useRouter);

    beforeEach(() => {
        mockedUseRouter.mockClear();
    });

    it("should render correctly", () => {
        const testRouter = useRouter();
        testRouter.query.search = "Smartphones";
        mockedUseRouter.mockImplementation(() => testRouter);

        const { queryByText, queryByDisplayValue } = render(
            <SearchDetails totalResults={10} categories={CATEGORIES_MOCK}/>
        );

        expect(queryByDisplayValue("Smartphones")).toBeInTheDocument();
        expect(queryByText("10 products")).toBeInTheDocument()
        
        expect(queryByText("Gamer")).toBeInTheDocument();
        expect(queryByText("Accesories")).toBeInTheDocument();
    });

    it("should render no categories available", () => {
        const { queryByText } = render(<SearchDetails totalResults={10} categories={[]}/>);

        expect(queryByText("No categories available")).toBeInTheDocument()
    });

    it("should change the body overflow when we activate or desactivate the filter", async () => {
        const { findByText } = render(
            <SearchDetails totalResults={10} categories={CATEGORIES_MOCK}/>
        );

        const toggleButton = await findByText("Filter");

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe("hidden");

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe("auto");
    });
});