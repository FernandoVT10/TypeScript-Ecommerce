import React from "react";

import { fireEvent, render, act } from "@testing-library/react";

import AddReview from "./AddReview";

const API_RESPONSE_MOCK = JSON.stringify({
    data: {
	createdReview: {
	    content: "created review",
	    calification: 5
	}
    }
});

describe("Domain Product ReviewsList AddReview", () => {
    beforeEach(() => {
	fetchMock.resetMocks();
    });

    it("should call the api to create a review", async () => {
	const { findByText, findByLabelText, container } = render(<AddReview setReviews={jest.fn()} productId="test-id"/>);

	const textarea = await findByLabelText("What did you think of the product?") as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: "test review content" } });

	const stars = container.querySelectorAll("i.far.fa-star");
	fireEvent.click(stars[2]);

	fetchMock.mockResponseOnce(API_RESPONSE_MOCK);

	const submitButton = await findByText("Add Review");
	await act(async () => fireEvent.click(submitButton));

	const fetchCall = fetchMock.mock.calls[0];

	expect(fetchCall[0]).toMatch(/products\/test-id\/reviews/);

	expect(fetchCall[1].body).toBe(JSON.stringify({
	    content: "test review content",
	    calification: 3
	}));
	expect(fetchCall[1].method).toBe("POST");
    });

    it("should call setReviews when we create a review", async () => {
	const setReviewsMock = jest.fn(() => []);

	const { findByText, findByLabelText, container } = render(<AddReview setReviews={setReviewsMock} productId="test-id"/>);

	const textarea = await findByLabelText("What did you think of the product?") as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: "test review content" } });

	const stars = container.querySelectorAll("i.far.fa-star");
	fireEvent.click(stars[2]);

	fetchMock.mockResponseOnce(API_RESPONSE_MOCK);

	const submitButton = await findByText("Add Review");
	await act(async () => fireEvent.click(submitButton));

	expect(setReviewsMock).toHaveBeenCalled();

	// we get the function into of the setReviews
	const setReviewsFunction = setReviewsMock.mock.calls[0] as any as [
	    (prevState: []) => []
	];

	expect(setReviewsFunction[0]([])).toEqual([
	    {
		content: "created review",
		calification: 5
	    }
	]);
    });

    it("should display a calification is required error", async () => {
	const { findByText, findByLabelText, queryByText } = render(<AddReview setReviews={jest.fn()} productId="test-id"/>);

	const textarea = await findByLabelText("What did you think of the product?") as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: "test review content" } });

	expect(queryByText("The calification is required")).not.toBeInTheDocument();

	const submitButton = await findByText("Add Review");
	fireEvent.click(submitButton);

	expect(queryByText("The calification is required")).toBeInTheDocument();
    });
});
