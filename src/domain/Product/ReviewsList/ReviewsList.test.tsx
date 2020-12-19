import React from "react";
import { mocked } from "ts-jest/utils";

import { render, act, screen, fireEvent } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import ReviewsList from "./ReviewsList";

jest.mock("@/services/ApiController");

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

const mockedAPIGet = mocked(ApiController.get);

describe("Domain Product ReviewsList", () => {
    beforeEach(() => {
	mockedAPIGet.mockReset();
	mockedAPIGet.mockResolvedValueOnce({
	    data: {
		canWriteAReview: true
	    }
	}).mockResolvedValueOnce({
	    data: {
		reviews: REVIEWS_MOCK
	    }
	});
    });

    it("should call the api correctly", async () => {
	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(mockedAPIGet).toHaveBeenCalledWith("products/test-id/reviews/userStatus");
	expect(mockedAPIGet).toHaveBeenCalledWith("products/test-id/reviews?limit=3&offset=0");
    });

    it("should render the reviews correctly", async () => {
	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(screen.queryByText("first review")).toBeInTheDocument();
	expect(screen.queryByText("second review")).toBeInTheDocument();
	expect(screen.queryByText("third review")).toBeInTheDocument();
    });

    it("should call the api when we click the load more reviews button", async () => {
	await act(async () => render(<ReviewsList productId="test-id"/>));

	mockedAPIGet.mockResolvedValueOnce([]);

	const loadMoreReviews = screen.getByText("Load more reviews");
	await act(async () => fireEvent.click(loadMoreReviews));

	expect(mockedAPIGet).toHaveBeenCalledWith("products/test-id/reviews?limit=3&offset=3");
    });

    it("shouldn't render the load more reviews button", async () => {
	mockedAPIGet.mockReset();
	mockedAPIGet
	    .mockResolvedValueOnce({ data: { canWriteAReview: true } })
	    .mockResolvedValueOnce({ data: { reviews: [] } });

	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(screen.queryByText("Load more reviews")).not.toBeInTheDocument();
    });

    it("shouldn't render the add review form", async () => {
	mockedAPIGet.mockReset();
	mockedAPIGet
	    .mockResolvedValueOnce({ data: { canWriteAReview: false } })
	    .mockResolvedValueOnce({ data: { reviews: [] } });

	await act(async () => render(<ReviewsList productId="test-id"/>));

	expect(screen.queryByText("What did you think of the product?")).not.toBeInTheDocument();
    });
});
