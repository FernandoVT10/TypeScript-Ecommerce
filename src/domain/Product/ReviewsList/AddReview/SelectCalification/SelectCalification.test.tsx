import React from "react";

import { fireEvent, render } from "@testing-library/react";

import SelectCalification from "./SelectCalification";

describe("@/domain/Product/ReviewList/AddReview/SelectCalification", () => {
    it("should render correclty", () => {
	const { getAllByTestId, queryByText } = render(
	    <SelectCalification calification={3} setCalification={jest.fn()}/>
	);

	const stars = getAllByTestId("select-calification-star");

	expect(stars[0].classList.contains("fas")).toBeTruthy();
	expect(stars[1].classList.contains("fas")).toBeTruthy();
	expect(stars[2].classList.contains("fas")).toBeTruthy();
	expect(stars[3].classList.contains("far")).toBeTruthy();
	expect(stars[4].classList.contains("far")).toBeTruthy();

	expect(queryByText("3 / 5")).toBeInTheDocument();
    });

    it("should change the stars class when we move our mouse over the stars", () => {
	const { getAllByTestId } = render(
	    <SelectCalification calification={3} setCalification={jest.fn()}/>
	);

	let stars = getAllByTestId("select-calification-star");
	fireEvent.mouseEnter(stars[3]);

	stars = getAllByTestId("select-calification-star");

	expect(stars[0].classList.contains("fas")).toBeTruthy();
	expect(stars[1].classList.contains("fas")).toBeTruthy();
	expect(stars[2].classList.contains("fas")).toBeTruthy();
	expect(stars[3].classList.contains("fas")).toBeTruthy();
	expect(stars[4].classList.contains("far")).toBeTruthy();
    });

    it("should call setCalification when we click on a star", () => {
	const setCalificationMock = jest.fn();

	const { getAllByTestId } = render(
	    <SelectCalification calification={3} setCalification={setCalificationMock}/>
	);

	const stars = getAllByTestId("select-calification-star");
	fireEvent.click(stars[1]);

	expect(setCalificationMock).toHaveBeenCalledWith(2);
    });
});
