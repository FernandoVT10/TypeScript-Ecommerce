import React from "react";

import { mocked } from "ts-jest/utils";

import { act, render, fireEvent, screen } from "@testing-library/react";

import ShoppingCartController, { CartItem } from "@/services/ShoppingCartController";
import ApiController from "@/services/ApiController";

import Navbar from "./Navbar";

window.scroll = jest.fn();

jest.mock("@/services/ShoppingCartController");
jest.mock("@/services/ApiController");

const mockedSCGetItems = mocked(ShoppingCartController.getItems);
const mockedWindowScroll = mocked(window.scroll);

const CART_ITEMS_MOCK = [
    "1", "2", "3", "4", "5"
] as any as CartItem[];

const mockedAPIGet = mocked(ApiController.get);

describe("Navbar Component", () => {
    beforeEach(() => {
        mockedWindowScroll.mockReset();
	
	mockedSCGetItems.mockReset();
	mockedSCGetItems.mockImplementation(() => CART_ITEMS_MOCK);

	mockedAPIGet.mockReset();
	mockedAPIGet.mockImplementation(() => Promise.resolve({ data: {} }));
    });

    it("should call the api and render correclty", async () => {
	await act(async () => render(<Navbar/>));

	expect(screen.queryByText("5")).toBeInTheDocument();
	expect(screen.queryAllByText("Edit Profile")).toHaveLength(2);
	expect(screen.queryByText("Login")).not.toBeInTheDocument();

	expect(mockedAPIGet).toHaveBeenCalledWith("account/getUserData");
    });

    it("should render when the user is not logged in", async () => {
	mockedAPIGet.mockImplementation(() => Promise.resolve({}));

	await act(async () => render(<Navbar/>));

	expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
	expect(screen.queryAllByText("Login")).toHaveLength(2);
    });

    it("should set the defaultValue in search inputs", async () => {
        changeRouterProperties({
            query: {
                search: "test search"
            }
        });

	await act(async () => render(<Navbar/>));

        expect(screen.queryAllByDisplayValue("test search").length).toBe(2);
    });

    it("should add and remove the navbarActive class", async () => {
	await act(async () => render(<Navbar/>));

        const nav = screen.getByTestId("navbar");
        expect(nav.classList.contains("navbarActive")).toBeFalsy();

        const toggleButton = screen.getByTestId("navbar-toggle-button");
        fireEvent.click(toggleButton);

        expect(nav.classList.contains("navbarActive")).toBeTruthy();
    });

    it("should call window scroll when we activate the navbar", async () => {
	await act(async () => render(<Navbar/>));

        const toggleButton = screen.getByTestId("navbar-toggle-button");
        fireEvent.click(toggleButton);

        expect(mockedWindowScroll).toHaveBeenCalledWith(0, 0);
    });

    it("should add hidden style to body overflow when we activate the navbar", async () => {
	await act(async () => render(<Navbar/>));

        const toggleButton = screen.getByTestId("navbar-toggle-button");
        fireEvent.click(toggleButton);

        expect(document.body.style.overflow).toBe("hidden");
    });

    it("should add auto style to body overflow when we activate the navbar", async () => {
	await act(async () => render(<Navbar/>));

        const toggleButton = screen.getByTestId("navbar-toggle-button");
        fireEvent.click(toggleButton);
        fireEvent.click(toggleButton);

        expect(document.body.style.overflow).toBe("auto");
    });
});
