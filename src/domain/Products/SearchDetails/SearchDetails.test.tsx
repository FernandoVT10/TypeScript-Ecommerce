import React from "react";

import { render, fireEvent } from "@testing-library/react";

import SearchDetails from "./SearchDetails";

jest.mock("next/link", () => ({ children }) => children);

const CATEGORIES_MOCK = [
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
    it("should render correctly", () => {
        changeRouterProperties({
            query: { search: "Smartphones" }
        });

        const { queryByText, queryByDisplayValue } = render(
            <SearchDetails totalProducts={10} categories={CATEGORIES_MOCK}/>
        );

        expect(queryByDisplayValue("Smartphones")).toBeInTheDocument();
        expect(queryByText("10 products")).toBeInTheDocument()
        
        expect(queryByText("Gamer")).toBeInTheDocument();
        expect(queryByText("Accesories")).toBeInTheDocument();
    });

    it("should render 'No categories available'", () => {
        const { queryByText } = render(<SearchDetails totalProducts={10} categories={[]}/>);

        expect(queryByText("No categories available")).toBeInTheDocument();
    });

    it("should add hidden style to body overflow when we activate the filter", async () => {
        const { findByText } = render(
            <SearchDetails totalProducts={10} categories={CATEGORIES_MOCK}/>
        );

        const toggleButton = await findByText("Filter");

        fireEvent.click(toggleButton);
        expect(document.body.style.overflow).toBe("hidden");
    });

    it("should add auto style to body overflow when we activate the filter", async () => {
        const { findByText } = render(
            <SearchDetails totalProducts={10} categories={CATEGORIES_MOCK}/>
        );

        const toggleButton = await findByText("Filter");

        fireEvent.click(toggleButton);
        fireEvent.click(toggleButton);

        expect(document.body.style.overflow).toBe("auto");
    });

    it("should add auto style to body overflow when we click on a category", async () => {
        const { findByText } = render(
            <SearchDetails totalProducts={10} categories={CATEGORIES_MOCK}/>
        );

        const category = await findByText("Gamer");

        fireEvent.click(category);

        expect(document.body.style.overflow).toBe("auto");
    });
});
