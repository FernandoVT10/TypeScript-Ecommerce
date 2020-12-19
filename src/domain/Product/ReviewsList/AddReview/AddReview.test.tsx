import React from "react";

import { fireEvent, render, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ApiController from "@/services/ApiController";

import AddReview from "./AddReview";

jest.mock("@/services/ApiController");

const API_RESPONSE_MOCK = {
    data: {
	createdReview: {
	    content: "created review",
	    calification: 5
	}
    }
}

const mockedAPIPost = mocked(ApiController.post);

describe("Domain Product ReviewsList AddReview", () => {
    beforeEach(() => {
	mockedAPIPost.mockReset();
    });

    it("shouldn't render when isActive is equal to false", () => {
	const { container } = render(
	    <AddReview
	    setReviews={jest.fn()}
	    productId="test-id"
	    isActive={false}
	    setIsActive={jest.fn()}/>
	);

	expect(container.children).toHaveLength(0);
    });

    it("should call the api to create a review", async () => {
	const setIsActiveMock = jest.fn();

	const { getByText, getByLabelText, getAllByTestId } = render(
	    <AddReview
	    setReviews={jest.fn()}
	    productId="test-id"
	    isActive={true}
	    setIsActive={setIsActiveMock}/>
	);

	const textarea = getByLabelText("Write your review") as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: "test review content" } });

	const stars = getAllByTestId("select-calification-star");
	fireEvent.click(stars[2]);

	mockedAPIPost.mockImplementation(() => Promise.resolve(API_RESPONSE_MOCK));

	const submitButton = getByText("Add Review");
	await act(async () => fireEvent.click(submitButton));

	expect(mockedAPIPost).toHaveBeenCalledWith("products/test-id/reviews/", {
	    body: {
		content: "test review content",
		calification: 3
	    }
	});

	expect(setIsActiveMock).toHaveBeenCalledWith(false);
    });

    it("should call setReviews when we create a review", async () => {
	const setReviewsMock = jest.fn(() => []);

	const { getByText, getByLabelText, getAllByTestId } = render(
	    <AddReview
	    setReviews={setReviewsMock}
	    productId="test-id"
	    isActive={true}
	    setIsActive={jest.fn()}/>
	);

	const textarea = getByLabelText("Write your review") as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: "test review content" } });

	const stars = getAllByTestId("select-calification-star");
	fireEvent.click(stars[2]);

	mockedAPIPost.mockImplementation(() => Promise.resolve(API_RESPONSE_MOCK));

	const submitButton = getByText("Add Review");
	await act(async () => fireEvent.click(submitButton));

	expect(setReviewsMock).toHaveBeenCalled();

	const setReviewsFunction = setReviewsMock.mock.calls[0] as any;

	expect(setReviewsFunction[0]([])).toEqual([
	    {
		content: "created review",
		calification: 5
	    }
	]);
    });

    it("should display an error when the calification is 0", async () => {
	const { getByText, getByLabelText, queryByText } = render(
	    <AddReview
	    setReviews={jest.fn()}
	    productId="test-id"
	    isActive={true}
	    setIsActive={jest.fn()}/>
	);

	const textarea = getByLabelText("Write your review") as HTMLTextAreaElement;
	fireEvent.change(textarea, { target: { value: "test review content" } });

	expect(queryByText("The calification is required")).not.toBeInTheDocument();

	const submitButton = getByText("Add Review");
	fireEvent.click(submitButton);

	expect(queryByText("The calification is required")).toBeInTheDocument();
    });
});
