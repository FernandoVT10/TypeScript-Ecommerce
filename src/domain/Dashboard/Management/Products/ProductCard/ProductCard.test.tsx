import React from "react";

import { render, act, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import ProductCard from "./ProductCard";

jest.mock("@/services/ApiController");

const PRODUCT_MOCK = {
    _id: "productId",
    title: "test title",
    images: ["test.jpg"],
    price: 20,
    discount: 50,
    inStock: 1990
}

const mockedAPIDelete = mocked(ApiController.delete);

describe("@/domain/Dashboard/Management/Products/ProductCard", () => {
    beforeEach(() => {
        mockedAPIDelete.mockReset();

        mockedAPIDelete.mockResolvedValue({});
    });

    it("should render correclty", () => {
	const { queryByText, getByAltText } = render(<ProductCard product={PRODUCT_MOCK} setProducts={jest.fn()}/>);

	const image = getByAltText("Product Card Image") as HTMLImageElement;
	expect(image.src).toMatch("/img/products/thumb-test.jpg");

	expect(queryByText("In Stock: 1990")).toBeInTheDocument();
	expect(queryByText("test title")).toBeInTheDocument();
	expect(queryByText("%50")).toBeInTheDocument();
	expect(queryByText("$ 10")).toBeInTheDocument();
	expect(queryByText("$ 20")).toBeInTheDocument();
    });

    it("should render without discount", () => {
	const product = {
	    ...PRODUCT_MOCK,
	    discount: 0
	}

	const { queryByText } = render(<ProductCard product={product} setProducts={jest.fn()}/>);

	expect(queryByText("%50")).not.toBeInTheDocument();
	expect(queryByText("$ 10")).not.toBeInTheDocument();
	expect(queryByText("$ 20")).toBeInTheDocument();
    });

    it("should call the api and setProducts to delete a product", async () => {
        const createAlertMock = jest.fn();
        const setProductsMock = jest.fn();

	const { getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <ProductCard product={PRODUCT_MOCK} setProducts={setProductsMock}/>
            </AlertsContext.Provider>
        );

        fireEvent.click(getByText("Delete"));
        await act(async () => fireEvent.click(getByText("Yes")));

        expect(mockedAPIDelete).toHaveBeenCalledWith("products/productId");
        expect(createAlertMock).toHaveBeenCalledWith("success", "The product has been deleted successfully");

        const setProductsFunction = setProductsMock.mock.calls[0][0];
        expect(setProductsFunction([PRODUCT_MOCK])).toEqual([]);
    });

    it("should create an error alert when the api returns an error", async () => {
        const createAlertMock = jest.fn();

	const { getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <ProductCard product={PRODUCT_MOCK} setProducts={jest.fn()}/>
            </AlertsContext.Provider>
        );

        fireEvent.click(getByText("Delete"));

        mockedAPIDelete.mockResolvedValue({
            error: "error",
            message: "test message"
        });

        await act(async () => fireEvent.click(getByText("Yes")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test message");
    });
});
