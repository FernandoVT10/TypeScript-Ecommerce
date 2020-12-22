import React from "react";

import { fireEvent, render } from "@testing-library/react";

import Modal from "./Modal";

describe("@/compoments/Modal", () => {
    it("should render correctly", () => {
	const { queryByText } = render(
	    <Modal isActive={true} setIsActive={jest.fn()}>
	    	<span>test children</span>
	    </Modal>
	);

	expect(queryByText("test children")).toBeInTheDocument();
    });

    it("shouldn't render when isActive is equal to false", () => {
	const { queryByText } = render(
	    <Modal isActive={false} setIsActive={jest.fn()}>
	    	<span>test children</span>
	    </Modal>
	);

	expect(queryByText("test children")).not.toBeInTheDocument();
    });

    it("should call setIsActive with false when we click the close button or modal background", () => {
	const setIsActiveMock = jest.fn();

	const { getByTestId } = render(
	    <Modal isActive={true} setIsActive={setIsActiveMock}>
	    	<span>test children</span>
	    </Modal>
	);

	const closeButton = getByTestId("close-modal-button");
	const modalBackground = getByTestId("modal-background");

	fireEvent.click(closeButton);
	fireEvent.click(modalBackground);

	expect(setIsActiveMock).toHaveBeenCalledTimes(2);
	expect(setIsActiveMock).toHaveBeenCalledWith(false);
    });

    it("should add the style hidden to body overflow when isActive will be true", () => {
	render(
	    <Modal isActive={true} setIsActive={jest.fn()}>
	    	<span>test children</span>
	    </Modal>
	);

	expect(document.body.style.overflow).toBe("hidden");
    });

    it("should add the style auto to body overflow when isActive will be false", () => {
	render(
	    <Modal isActive={false} setIsActive={jest.fn()}>
	    	<span>test children</span>
	    </Modal>
	);

	expect(document.body.style.overflow).toBe("auto");
    });
});