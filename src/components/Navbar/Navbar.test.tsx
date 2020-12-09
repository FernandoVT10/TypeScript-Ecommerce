import React from "react";

import { mocked } from "ts-jest/utils";

import { render, fireEvent } from "@testing-library/react";

import ShoppingCartController, { CartItem } from "@/services/ShoppingCartController";

import Navbar from "./Navbar";

window.scroll = jest.fn();

jest.mock("@/services/ShoppingCartController");

const mockedSCGetItems = mocked(ShoppingCartController.getItems);
const mockedWindowScroll = mocked(window.scroll);

const CART_ITEMS_MOCK = [
    "1", "2", "3", "4", "5"
] as any as CartItem[];

Object.defineProperty(process, "browser", {
    value: true
});

describe("Navbar Component", () => {
    beforeEach(() => {
        mockedWindowScroll.mockReset();
	
	mockedSCGetItems.mockReset();
	mockedSCGetItems.mockImplementation(() => CART_ITEMS_MOCK);
    });

    it("should render correclty", () => {
        const { queryByText, debug } = render(<Navbar/>);
	expect(queryByText("5")).toBeInTheDocument();
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
