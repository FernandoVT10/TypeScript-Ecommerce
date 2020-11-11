import React from "react";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { mocked } from "ts-jest/utils";

import ShoppingCartController from "@/services/ShoppingCartController";

import ShoppingCart from "./ShoppingCart";

const SHOPPING_CART_MOCK = [
    {
	productId: "id-1",
	quantity: 5
    },
    {
	productId: "id-2",
	quantity: 10
    },
    {
	productId: "id-3",
	quantity: 15
    }
];

jest.mock("@/services/ShoppingCartController");

const PRODUCTS_MOCK = [
    {
	_id: "id-1",
	title: "test title 1",
	images: ["test-1.jpg"],
	price: 700,
	discount: 25,
	inStock: 5
    },
    {
	_id: "id-2",
	title: "test title 2",
	images: ["test-2.jpg"],
	price: 1400,
	discount: 50,
	inStock: 10
    },
    {
	_id: "id-3",
	title: "test title 3",
	images: ["test-3.jpg"],
	price: 2800,
	discount: 75,
	inStock: 15
    }
];

const mockedShoppingCartGetItems = mocked(ShoppingCartController.getItems);
const mockedShoppingCartDeleteItem = mocked(ShoppingCartController.deleteItem);
const mockedShoppingCartUpdateItem = mocked(ShoppingCartController.updateItem);

describe("Domain Shopping Cart component", () => {
    beforeEach(() => {
	fetchMock.resetMocks();

	mockedShoppingCartGetItems.mockReset();
	mockedShoppingCartGetItems.mockImplementation(
	    () => SHOPPING_CART_MOCK
	);

	mockedShoppingCartDeleteItem.mockReset();
	mockedShoppingCartUpdateItem.mockReset();

	fetchMock.once(JSON.stringify({ data: { product: PRODUCTS_MOCK[0] } }))
	    .once(JSON.stringify({ data: { product: PRODUCTS_MOCK[1] } }))
	    .once(JSON.stringify({ data: { product: PRODUCTS_MOCK[2] } }));
    });

    it("should call the api correctly", async () => {
	await act(async () => render(<ShoppingCart/>));

	const fetchCalls = fetchMock.mock.calls;

	expect(fetchCalls[0][0]).toMatch("products/id-1");
	expect(fetchCalls[1][0]).toMatch("products/id-2");
	expect(fetchCalls[2][0]).toMatch("products/id-3");

	expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("should render the api data correctly", async () => {
	await act(async () => render(<ShoppingCart/>));

	expect(screen.queryByText("test title 1")).toBeInTheDocument();
	expect(screen.queryByText("test title 2")).toBeInTheDocument();
	expect(screen.queryByText("test title 3")).toBeInTheDocument();

	// Total Price
	expect(screen.queryByText("$ 59 500"));
    });

    it("should render without cart elements correctly", async () => {
	mockedShoppingCartGetItems.mockImplementation(() => []);

	await act(async () => render(<ShoppingCart/>));

	expect(
	    screen.queryByText("There are not products in your shopping cart")
	).toBeInTheDocument();
	expect(screen.queryByText("Continue")).not.toBeInTheDocument();
    });

    describe("Remove Product From Cart", () => {
	it("should call the deleteItem from Shopping Cart Controller", async () => {
	    await act(async () => render(<ShoppingCart/>));

	    const removeLink = await screen.findAllByText("Remove");
	    fireEvent.click(removeLink[1]);

	    expect(mockedShoppingCartDeleteItem).toHaveBeenCalledWith("id-2");
	});

	it("should remove the product from the products array", async () => {
	    await act(async () => render(<ShoppingCart/>));

	    expect(screen.queryByText("test title 3")).toBeInTheDocument();

	    const removeLink = await screen.findAllByText("Remove");
	    fireEvent.click(removeLink[2]);

	    expect(screen.queryByText("test title 3")).not.toBeInTheDocument();
	});
    });

    describe("Update Quantity On Cart", () => {
	it("should call the updateItem from Shopping Cart Controller", async () => {
	    await act(async () => render(<ShoppingCart/>));

	    const subtractButtob = await screen.findAllByText("-");
	    fireEvent.click(subtractButtob[1]);

	    expect(mockedShoppingCartUpdateItem).toHaveBeenCalledWith("id-2", 9);
	});

	it("should update the product quantity from the products array", async () => {
	    await act(async () => render(<ShoppingCart/>));

	    const productQuantity = await screen.findAllByTestId(
		"quantity-selector-input"
	    ) as HTMLInputElement[];

	    expect(productQuantity[2].value).toBe("15");

	    const subtractButtob = await screen.findAllByText("-");
	    fireEvent.click(subtractButtob[2]);

	    expect(productQuantity[2].value).toBe("14");
	});
    });
});
