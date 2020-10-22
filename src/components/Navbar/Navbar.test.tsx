import React from "react";

import { mocked } from "ts-jest/utils";

import { render, fireEvent } from "@testing-library/react";

import Navbar from "./Navbar";

window.scroll = jest.fn();

describe("Navbar Component", () => {
    const mockedWindowScroll = mocked(window.scroll);

    beforeEach(() => {
        mockedWindowScroll.mockReset();
    });

    it("should render correclty", () => {
        render(<Navbar/>);
    });

    it("should set the defaultValue in search inputs", async () => {
        changeRouterProperties({
            query: {
                search: "test search"
            }
        });

        const { queryAllByDisplayValue } = render(<Navbar/>);

        expect(queryAllByDisplayValue("test search").length).toBe(2);
    });

    it("should add and remove the navbarActive class", async () => {
        const { findByTestId } = render(<Navbar/>);

        const nav = await findByTestId("navbar");

        expect(nav.classList.contains("navbarActive")).toBeFalsy();

        const toggleButton = await findByTestId("navbar-toggle-button");

        fireEvent.click(toggleButton);

        expect(nav.classList.contains("navbarActive")).toBeTruthy();
    });

    it("should call window scroll when we activate the navbar", async () => {
        const { findByTestId } = render(<Navbar/>);

        const toggleButton = await findByTestId("navbar-toggle-button");

        fireEvent.click(toggleButton);

        expect(mockedWindowScroll).toHaveBeenCalledWith(0, 0);
    });

    it("should add hidden style to body overflow when we activate the navbar", async () => {
        const { findByTestId } = render(<Navbar/>);

        const toggleButton = await findByTestId("navbar-toggle-button");

        fireEvent.click(toggleButton);

        expect(document.body.style.overflow).toBe("hidden");
    });

    it("should add auto style to body overflow when we activate the navbar", async () => {
        const { findByTestId } = render(<Navbar/>);

        const toggleButton = await findByTestId("navbar-toggle-button");

        fireEvent.click(toggleButton);
        fireEvent.click(toggleButton);

        expect(document.body.style.overflow).toBe("auto");
    });
});