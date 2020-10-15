import React from "react";

import { render, fireEvent } from "@testing-library/react";

import Navbar from "./Navbar";

describe("Navbar Component", () => {
    it("should render correclty", () => {
        render(<Navbar/>);
    });

    it("should add and remove the navbarActive class", async () => {
        const { findByTestId } = render(<Navbar/>);

        const nav = await findByTestId("navbar");

        expect(nav.classList.contains("navbarActive")).toBeFalsy();

        const toggleButton = await findByTestId("navbar-toggle-button");

        fireEvent.click(toggleButton);

        expect(nav.classList.contains("navbarActive")).toBeTruthy();
    });
});