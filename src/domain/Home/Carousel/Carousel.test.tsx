import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Carousel from "./Carousel";

const CAROUSEL_DATA_MOCK = [
    {
        _id: "1",
        image: "test-1.jpg",
        link: "https://example.com"
    },
    {
        _id: "2",
        image: "test-2.jpg",
        link: "https://example.com"
    },
    {
        _id: "3",
        image: "test-3.jpg",
        link: "https://example.com"
    }
];

describe("Domain Home Carousel", () => {
    it("should render correctly", async () => {
        const { findAllByTestId, findAllByAltText } = render(<Carousel carouselData={CAROUSEL_DATA_MOCK}/>);

        const images = await findAllByAltText("Carousel Image");
        const indicators = await findAllByTestId("carousel-indicator");

        expect(images.length).toBe(3);
        expect(images[0].classList.contains("active")).toBeTruthy();
        expect(indicators.length).toBe(3);
    });

    it("should change the active image and direction with the carousel controls", async () => {
        const { findAllByTestId, findAllByAltText } = render(<Carousel carouselData={CAROUSEL_DATA_MOCK}/>);

        const images = await findAllByAltText("Carousel Image");
        const controls = await findAllByTestId("carousel-button");

        fireEvent.click(controls[1]);

        expect(images[0].classList.contains("active")).toBeFalsy();
        expect(images[1].classList.contains("active")).toBeTruthy();
        expect(images[1].classList.contains("right")).toBeTruthy();

        fireEvent.click(controls[0]);

        expect(images[1].classList.contains("active")).toBeFalsy();
        expect(images[0].classList.contains("active")).toBeTruthy();
        expect(images[0].classList.contains("right")).toBeFalsy();
    });

    it("should change the active image and direction with the carousel indicators", async () => {
        const { findAllByTestId, findAllByAltText } = render(<Carousel carouselData={CAROUSEL_DATA_MOCK}/>);

        const images = await findAllByAltText("Carousel Image");
        const indicators = await findAllByTestId("carousel-indicator");

        fireEvent.click(indicators[2]);

        expect(images[0].classList.contains("active")).toBeFalsy();
        expect(images[2].classList.contains("active")).toBeTruthy();
        expect(images[2].classList.contains("right")).toBeTruthy();

        fireEvent.click(indicators[0]);

        expect(images[2].classList.contains("active")).toBeFalsy();
        expect(images[0].classList.contains("active")).toBeTruthy();
        expect(images[0].classList.contains("right")).toBeFalsy();
    });
});