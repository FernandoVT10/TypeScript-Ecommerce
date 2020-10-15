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

describe("Domain Home Products Carousel", () => {
    it("should render correctly", () => {
        const { getAllByText } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        expect(getAllByText("test product title").length).toBe(2);
    });

    it("should activate the right control", async () => {
        jest.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => 1920);

        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const leftControl = await findByTestId("products-carousel-left-control");
        const rightControl = await findByTestId("products-carousel-right-control");

        expect(leftControl.classList.contains("inactive")).toBeTruthy();
        expect(rightControl.classList.contains("inactive")).toBeFalsy();
    });

    it("should scroll the products container with the carousel buttons", async () => {
        const scrollMock = jest.fn();

        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const productsContainer = await findByTestId("products-carousel-products-container");
        productsContainer.scroll = scrollMock;

        const rightControl = await findByTestId("products-carousel-right-control");
        const leftControl = await findByTestId("products-carousel-left-control");

        fireEvent.click(rightControl);

        expect(scrollMock).toHaveBeenCalledWith({
            left: 1220,
            behavior: "smooth"
        });

        fireEvent.click(leftControl);

        expect(scrollMock).toHaveBeenCalledWith({
            left: -1220,
            behavior: "smooth"
        });
    });

    it("should activate and desactivate the carousel buttons", async () => {
        const { findByTestId } = render(<ProductsCarousel products={PRODUCTS_MOCK}/>);

        const productsContainer = await findByTestId("products-carousel-products-container");
        productsContainer.scroll = () => {};

        const rightControl = await findByTestId("products-carousel-right-control");
        const leftControl = await findByTestId("products-carousel-left-control");

        fireEvent.click(rightControl);

        expect(leftControl.classList.contains("inactive")).toBeFalsy();
        expect(rightControl.classList.contains("inactive")).toBeTruthy();

        fireEvent.click(leftControl);

        expect(leftControl.classList.contains("inactive")).toBeTruthy();
        expect(rightControl.classList.contains("inactive")).toBeFalsy();
    });
});