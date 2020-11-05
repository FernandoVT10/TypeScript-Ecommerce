import React from "react";

import { render, act, screen, fireEvent } from "@testing-library/react";

import ReviewsList from "./ReviewsList";

const REVIEWS_MOCK = [
    {
	content: "first review",
	calification: 5
    },
    {
	content: "second review",
	calification: 4
    },
    {
	content: "third review",
	calification: 3
    }
];

describe("Domain Product ReviewsList", () => {
    beforeEach(() => {
	fetchMock.resetMocks();
    });

    it("should call the api correctly", async () => {
	fetchMock.mockResponseOnce(JSON.stringify({ data: { reviews: REVIEWS_MOCK } }));

	await act(async () => render(<ReviewsList productId="test-id"/>));

	const fetchCall = fetchMock.mock.calls[0];

	expect(fetchCall[0]).toMatch("products/test-id/reviews?limit=3&offset=0");
    });

    it("should render the reviews correctly", async () => {
	fetchMock.mockResponseOnce(JSON.stringify({ data: { reviews: REVIEWS_MOCK } }));

	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(screen.queryByText("first review")).toBeInTheDocument();
	expect(screen.queryByText("second review")).toBeInTheDocument();
	expect(screen.queryByText("third review")).toBeInTheDocument();
    });

    it("should render the message there are no reviews correctly", async () => {
	fetchMock.mockResponseOnce(JSON.stringify({ data: { reviews: [] } }));

	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(screen.queryByText("There are no reviews to display")).toBeInTheDocument();
    });

    it("should call the api when we click the load more reviews button", async () => {
	fetchMock.mockResponseOnce(JSON.stringify({ data: { reviews: REVIEWS_MOCK } }));

	await act(async () => render(<ReviewsList productId="test-id"/>));

	fetchMock.mockResponseOnce(JSON.stringify(REVIEWS_MOCK));

	const loadMoreReviews = await screen.findByText("Load more reviews");
	await act(async () => fireEvent.click(loadMoreReviews));

	const fetchCall = fetchMock.mock.calls[1];

	expect(fetchCall[0]).toMatch("products/test-id/reviews?limit=3&offset=3");
    });

    it("shouldn't render the load more reviews button", async () => {
	fetchMock.mockResponseOnce(JSON.stringify({ data: { reviews: [] } }));

	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(screen.queryByText("Load more reviews")).not.toBeInTheDocument();
    });
});
