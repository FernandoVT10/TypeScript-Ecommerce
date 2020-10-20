import React from "react";

import { render } from "@testing-library/react";

import { PaginationProps } from "@/components/Pagination";
import { ProductCardProps } from "@/components/ProductCard";

import ProductList from "./ProductList";

const PRODUCTS_MOCK: ProductCardProps[] = [
    {
        _id: "test-id",
        images: ["test-2.jpg"],
        title: "test title 1",
        price: 10,
        discount: 0,
        description: "test description"
    },
    {
        _id: "test-id-2",
        images: ["test-2.jpg"],
        title: "test title 2",
        price: 18,
        discount: 50,
        description: "test description 2"
    }
];

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

describe("Domain Products Product List", () => {
    it("should render correclty", async () => {
        const { rerender, queryByText } = render(<ProductList products={[]} pagination={PAGINATION_MOCK}/>);

        expect(queryByText("Results not found")).toBeInTheDocument();

        rerender(<ProductList products={PRODUCTS_MOCK} pagination={PAGINATION_MOCK}/>);

        expect(queryByText("Results not found")).not.toBeInTheDocument();
        expect(queryByText("test description")).toBeInTheDocument();
        expect(queryByText("test description 2")).toBeInTheDocument();

        expect(queryByText("3")).toBeInTheDocument();
        expect(queryByText("4")).toBeInTheDocument();
        expect(queryByText("5")).toBeInTheDocument();
    });
});