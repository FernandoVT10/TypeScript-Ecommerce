import React from "react";

import { fireEvent, render } from "@testing-library/react";

import RangeInput from "./RangeInput";

describe("@/compoments/Formulary/RangeInput", () => {
    it("should render correclty", () => {
	const { queryByText, queryByTestId } = render(
	    <RangeInput min={10} max={80} value={40} setValue={jest.fn()}/>
	);

	const rangeInput = queryByTestId("range-input") as HTMLInputElement;
	expect(rangeInput.value).toBe("40");

	expect(queryByText("40 / 80")).toBeInTheDocument();
    });

    it("should call setValue when we change the range input value", () => {
	const setValueMock = jest.fn();

	const { queryByTestId } = render(
	    <RangeInput min={10} max={80} value={40} setValue={setValueMock}/>
	);

	const rangeInput = queryByTestId("range-input") as HTMLInputElement;
	fireEvent.change(rangeInput, { target: { value: "77" } });

	expect(setValueMock).toHaveBeenCalledWith(77);
    });

    it("should change the background size when we change the range input value", () => {
	const { queryByTestId } = render(
	    <RangeInput min={0} max={10} value={8} setValue={jest.fn()}/>
	);

	const style = document.body.lastChild as HTMLStyleElement;

	expect(style.innerText).toMatch("background-size: 80% 100% !important;");

	const rangeInput = queryByTestId("range-input") as HTMLInputElement;
	fireEvent.change(rangeInput, { target: { value: "5" } });

	expect(style.innerText).toMatch("background-size: 50% 100% !important;");
    });
});
