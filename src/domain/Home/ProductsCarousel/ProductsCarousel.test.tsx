import React from "react";

import { render, fireEvent } from "@testing-library/react";

import ProductsCarousel from "./ProductsCarousel";

const PRODUCTS_MOCK = [
    {
        _id: "test-id-1",
        images: ["test-1.jpg"],
        title: "test product title",
        price: 18,
        discount: 50,
        description: "test description"
    },
    {
        _id: "test-id-2",
        images: ["test-2.jpg"],
        title: "test product title",
        price: 18,
        discount: 50,
        description: "test description"
    }
];

jest.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => 1920);

describe("Domain Home Products Carousel", () => {
    it("should render correctly", () => {
        const { getAllByText } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        expect(getAllByText("test product title").length).toBe(2);
    });

    it("should activate the right control", async () => {
        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const leftControl = await findByTestId("products-carousel-left-control");
        const rightControl = await findByTestId("products-carousel-right-control");

        expect(leftControl.classList.contains("inactive")).toBeTruthy();
        expect(rightControl.classList.contains("inactive")).toBeFalsy();
    });

    it("should scroll to left", async () => {
        const scrollMock = jest.fn();

        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const productsContainer = await findByTestId("products-carousel-products-container");
        productsContainer.scroll = scrollMock;

        const leftControl = await findByTestId("products-carousel-left-control");

        fireEvent.click(leftControl);

        expect(scrollMock).toHaveBeenCalledWith({
            left: -1220,
            behavior: "smooth"
        });
    });

    it("should scroll to right", async () => {
        const scrollMock = jest.fn();

        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const productsContainer = await findByTestId("products-carousel-products-container");
        productsContainer.scroll = scrollMock;

        const rightControl = await findByTestId("products-carousel-right-control");

        fireEvent.click(rightControl);

        expect(scrollMock).toHaveBeenCalledWith({
            left: 1220,
            behavior: "smooth"
        });
    });

    it("should add inactive class to left button and delete the class in right button", async () => {
        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const productsContainer = await findByTestId("products-carousel-products-container");
        productsContainer.scroll = () => {};

        const leftControl = await findByTestId("products-carousel-left-control");
        const rightControl = await findByTestId("products-carousel-right-control");

        fireEvent.click(leftControl);

        expect(leftControl.classList.contains("inactive")).toBeTruthy();
        expect(rightControl.classList.contains("inactive")).toBeFalsy();
    });

    it("should add inactive class to right button and delete the class in left button", async () => {
        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const productsContainer = await findByTestId("products-carousel-products-container");
        productsContainer.scroll = () => {};

        const leftControl = await findByTestId("products-carousel-left-control");
        const rightControl = await findByTestId("products-carousel-right-control");

        fireEvent.click(rightControl);

        expect(leftControl.classList.contains("inactive")).toBeFalsy();
        expect(rightControl.classList.contains("inactive")).toBeTruthy();
    });
});