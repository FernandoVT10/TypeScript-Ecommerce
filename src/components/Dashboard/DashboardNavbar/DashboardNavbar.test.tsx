import React from "react";

import { fireEvent, render } from "@testing-library/react";

import DashboardNavbar from "./DashboardNavbar";

describe("Dashboard DashboardNavbar Component", () => {
    it("should renders correctly", () => {
	const { queryByText } = render(<DashboardNavbar name="test name"/>);

	expect(queryByText("test name")).toBeInTheDocument();
    });

    it("should hidden the body scroll when isActive is true and the window.innerWidth is less than or equal to 1200", () => {
	const { getByTestId } = render(<DashboardNavbar name="test name"/>);

	fireEvent.click(getByTestId("toggle-button"));

	expect(document.body.style.overflow).toBe("hidden");
    });

    it("should show the body scroll when isActive is false", () => {
	const { getByTestId } = render(<DashboardNavbar name="test name"/>);

	fireEvent.click(getByTestId("toggle-button"));

	fireEvent.click(getByTestId("toggle-button"));

	expect(document.body.style.overflow).toBe("auto");
    });
});
