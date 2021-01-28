import React from "react";

import { render } from "@testing-library/react";

import ProductCard from "./ProductCard";

const PRODUCT_MOCK = {
    _id: "test-id",
    images: ["test-1.jpg"],
    title: "test title 12",
    price: 180.50,
    discount: 50,
    description: "test description"
}

describe("ProductCard Component", () => {
    it("should render correctly", async () => {
        const { queryByText } = render(<ProductCard product={PRODUCT_MOCK}/>);

        expect(queryByText("50%").closest("a")).toHaveAttribute(
            "href", "/products/test-id"
        );
        expect(queryByText("50%")).toBeInTheDocument();
        expect(queryByText("test title 12")).toBeInTheDocument();
        expect(queryByText("test description")).toBeInTheDocument();
        expect(queryByText("$ 90.25")).toBeInTheDocument();
    });
});
