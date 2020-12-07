import React from "react";

import { render, fireEvent } from "@testing-library/react";

import ConfirmationModal from "./ConfirmationModal";

describe("Confimation Modal Component", () => {
    it("should renders correctly", () => {
	const { getByText } = render(
	    <ConfirmationModal
	    message="This is a message"
	    isActive={true}
	    setIsActive={jest.fn()}
	    onConfirm={jest.fn()}/>
	);

	expect(getByText("This is a message")).toBeInTheDocument();
    });

    it("should renders null", () => {
	const { container } = render(
	    <ConfirmationModal
	    message="This is a message"
	    isActive={false}
	    setIsActive={jest.fn()}
	    onConfirm={jest.fn()}/>
	);

	expect(container.children).toHaveLength(0);
    });

    it("should activate or desactivate the document scroll", () => {
	const { rerender } = render(
	    <ConfirmationModal
	    message="This is a message"
	    isActive={true}
	    setIsActive={jest.fn()}
	    onConfirm={jest.fn()}/>
	);

	expect(document.body.style.overflow).toBe("hidden");

	rerender(
	    <ConfirmationModal
	    message="This is a message"
	    isActive={false}
	    setIsActive={jest.fn()}
	    onConfirm={jest.fn()}/>
	);

	expect(document.body.style.overflow).toBe("auto");
    });

    it("should call setIsActive when we click the 'No' button", () => {
	const setIsActiveMock = jest.fn();

	const { getByText } = render(
	    <ConfirmationModal
	    message="This is a message"
	    isActive={true}
	    setIsActive={setIsActiveMock}
	    onConfirm={jest.fn()}/>
	);

	const noButton = getByText("No");
	fireEvent.click(noButton);

	expect(setIsActiveMock).toHaveBeenCalledWith(false);
    });

    it("should call onConfirm and setIsActive when we click the 'Yes' button", () => {
	const setIsActiveMock = jest.fn();
	const onConfirmMock = jest.fn();

	const { getByText } = render(
	    <ConfirmationModal
	    message="This is a message"
	    isActive={true}
	    setIsActive={setIsActiveMock}
	    onConfirm={onConfirmMock}/>
	);

	const noButton = getByText("Yes");
	fireEvent.click(noButton);

	expect(setIsActiveMock).toHaveBeenCalledWith(false);
	expect(onConfirmMock).toHaveBeenCalled();
    });
});
