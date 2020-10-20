import React from "react";

import { render } from "@testing-library/react";

import { PaginationProps } from "@/components/Pagination";
import { ProductCardProps } from "@/components/ProductCard";

import { Category } from "./SearchDetails";

import Products from "./Products";

const PRODUCTS_MOCK: ProductCardProps[] = [
    {
        _id: "test-id",
        images: ["test-2.jpg"],
        title: "test title 1",
        price: 10,
        discount: 0,
        description: "test description"
    }
];

const PAGINATION_MOCK: PaginationProps = {
    hasPrevPage: false,
    prevPage: null,
    hasNextPage: false,
    nextPage: null,
    pages: [
        {
            active: true,
            pageNumber: 5
        }
    ]
}

const CATEGORIES_MOCK: Category[] = [
    {
        _id: "test-category-1",
        name: "Gamer"
    }
];

describe("Domain Products", () => {
    it("should render correctly", () => {
        const { queryByText } = render(
            <Products
            products={PRODUCTS_MOCK}
            totalResults={100}
            pagination={PAGINATION_MOCK}
            categories={CATEGORIES_MOCK}/>
        );

        expect(queryByText("test description")).toBeInTheDocument();

        expect(queryByText("100 products")).toBeInTheDocument();

        expect(queryByText("5")).toBeInTheDocument();

        expect(queryByText("Gamer")).toBeInTheDocument();
    });
});