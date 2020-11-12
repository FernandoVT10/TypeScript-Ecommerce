import React from "react";

import { fireEvent, render } from "@testing-library/react";

import ImagesCarousel from "./ImagesCarousel";

const IMAGES_MOCK = ["test-1.jpg", "test-2.jpg", "test-3.jpg"];

describe("Domian Product ImagesCarousel", () => {
    it("should render the images correctly", async () => {
	const { findAllByAltText, findByAltText } = render(<ImagesCarousel images={IMAGES_MOCK}/>);

	const images = await findAllByAltText("Product Carousel Image") as HTMLImageElement[];

	expect(images[0].src).toMatch("thumb-test-1.jpg");
	expect(images[1].src).toMatch("thumb-test-2.jpg");
	expect(images[2].src).toMatch("thumb-test-3.jpg");

	const activeImage = await findByAltText("Product Carousel Image Active") as HTMLImageElement;

	expect(activeImage.srcset).toMatch("test-1.jpg");
    });

    it("should change the active image when we click to a carousel image", async () => {
	const { findAllByAltText, findByAltText } = render(<ImagesCarousel images={IMAGES_MOCK}/>);

	const images = await findAllByAltText("Product Carousel Image");

	fireEvent.click(images[2]);

	const activeImage = await findByAltText("Product Carousel Image Active") as HTMLImageElement;

	expect(activeImage.srcset).toMatch("test-3.jpg");

	fireEvent.click(images[0]);

	expect(activeImage.srcset).toMatch("test-1.jpg");
    });
});
