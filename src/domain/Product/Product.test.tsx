import React from "react";

import { render, act, screen } from "@testing-library/react";

import Product from "./Product";

const REVIEWS_COUNT_MOCK = {
    oneStar: 1,
    twoStars: 5,
    threeStars: 5,
    fourStars: 5,
    fiveStars: 9,
    totalReviews: 25
}

const PRODUCT_MOCK = {
    _id: "test-id",
    title: "Test title",
    description: "this is a test description",
    images: ["test-1.jpg"],
    calification: 4.8,
    price: 10000,
    inStock: 31,
    discount: 50,
    arrivesIn: "1 century",
    warranty: "Test warranty"
}

const RECOMMENDED_PRODUCTS_MOCK = [
    {
	_id: "test-id",
	title: "recommended title",
	description: "description",
	images: [],
	calification: 4.8,
	price: 10000,
	inStock: 31,
	discount: 50,
	arrivesIn: "1 century",
	warranty: "Test warranty"
    }
];

describe("Domain Product", () => {
    beforeEach(() => {
	fetchMock.resetMocks();
	fetchMock.mockResponse(JSON.stringify({ data: { reviews: [] } }));
    });

    it("should render correctly", async () => {
	await act(async () => render(
	    <Product
	    product={PRODUCT_MOCK}
	    recommendedProducts={RECOMMENDED_PRODUCTS_MOCK}
	    reviewsCount={REVIEWS_COUNT_MOCK}/>
	));

	// Images Carousel
	const image = await screen.findByAltText("Product Carousel Image Active") as HTMLImageElement;
	expect(image.srcset).toMatch("test-1.jpg");

	// Product Details
	expect(screen.queryByText("Test title")).toBeInTheDocument();

	// Description
	expect(screen.queryByText("this is a test description")).toBeInTheDocument();

	// Calification Table and Product Details
	expect(screen.queryAllByText("25 reviews")).toHaveLength(2);

	// Reviews List
	const fetchCall = fetchMock.mock.calls[0];
	expect(fetchCall[0]).toMatch("test-id");

	// Product Carousel
	expect(screen.queryByText("recommended title")).toBeInTheDocument();
    });

    it("shouldn't render the products carousel", async () => {
	await act(async () => render(
	    <Product
	    product={PRODUCT_MOCK}
	    recommendedProducts={[]}
	    reviewsCount={REVIEWS_COUNT_MOCK}/>
	));

	expect(screen.queryByTestId("products-carousel-products-container")).not.toBeInTheDocument();
    });
});
