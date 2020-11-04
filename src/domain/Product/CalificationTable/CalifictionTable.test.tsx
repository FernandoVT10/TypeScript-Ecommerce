import React from "react";

import { render } from "@testing-library/react";

import CalificationTable from "./CalificationTable";

const REVIEWS_COUNT_MOCK = {
    oneStar: 1,
    twoStars: 5,
    threeStars: 5,
    fourStars: 5,
    fiveStars: 9,
    totalReviews: 25
}

describe("Domain Product CalificationTable", () => {
    it("should render the data correclty", () => {
	const { queryByText } = render(
	    <CalificationTable
	    calification={4.8}
	    reviewsCount={REVIEWS_COUNT_MOCK}/>
	);

	expect(queryByText("4.8")).toBeInTheDocument();
	expect(queryByText("25 reviews")).toBeInTheDocument();

	expect(queryByText("5 stars")).toBeInTheDocument();
	expect(queryByText("1 stars")).toBeInTheDocument();
    });

    it("should set the reviews count bars width correctly", async () => {
	const { findAllByTestId } = render(
	    <CalificationTable
	    calification={4.8}
	    reviewsCount={REVIEWS_COUNT_MOCK}/>
	);

	const bars: HTMLSpanElement[] = await findAllByTestId("countBar");

	expect(bars[0].style.width).toBe("36px");
	expect(bars[4].style.width).toBe("4px");
    });
});
