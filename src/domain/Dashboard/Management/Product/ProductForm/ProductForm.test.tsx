import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { InputHadnlingResponse } from "@/hooks/useInputHandling";

import ProductForm from "./ProductForm";

jest.mock("./Categories", () => ({ selectedCategories }) => {
    return (
        <div>
            {selectedCategories.map(category => <span key={category}>{ category }</span>)}
        </div>
    );
});

jest.mock("./Carousel", () => ({ images }) => {
    return (
        <div>
            {images.map(image => <span key={image}>{ image }</span>)}
        </div>
    );
});

const useInputHandlingMock = (value: string | number, error = "") => ({
    value,
    setValue: jest.fn(),
    error,
    setError: jest.fn(),
} as InputHadnlingResponse<string>);

const renderProductForm = (discount = 50) => {
    const titleHandler = useInputHandlingMock("test title");
    const priceHandler = useInputHandlingMock("10");
    const discountHandler = useInputHandlingMock(discount) as any;
    const inStockHandler = useInputHandlingMock("100");
    const warrantyHandler = useInputHandlingMock("test warranty");
    const descriptionHandler = useInputHandlingMock("test description");

    const setNewImages = jest.fn();
    const setDeletedImages = jest.fn();
    const setSelectedCategories = jest.fn();
    const handleOnSubmit = jest.fn();

    render(
        <ProductForm
            images={["test-1.jpg", "test-2.jpg"]}
            setNewImages={setNewImages}
            setDeletedImages={setDeletedImages}
            titleHandler={titleHandler}
            priceHandler={priceHandler}
            discountHandler={discountHandler}
            inStockHandler={inStockHandler}
            warrantyHandler={warrantyHandler}
            descriptionHandler={descriptionHandler}
            selectedCategories={["test category 1", "test category 2"]}
            setSelectedCategories={setSelectedCategories}
            handleOnSubmit={handleOnSubmit}
            loading={false}
        />
    );

    return {
        titleHandler,
        priceHandler,
        discountHandler,
        inStockHandler,
        warrantyHandler,
        descriptionHandler,
        setNewImages,
        setDeletedImages,
        setSelectedCategories,
        handleOnSubmit
    }
}

describe("@/domain/Dashboard/Management/Product/ProductForm", () => {
    describe("rendering", () => {
        it("should render correclty", () => {
            renderProductForm();

            expect(screen.queryByText("test-1.jpg")).toBeInTheDocument();
            expect(screen.queryByText("test-2.jpg")).toBeInTheDocument();

            expect(screen.queryByDisplayValue("test title")).toBeInTheDocument;

            // price
            expect(screen.queryByDisplayValue("10")).toBeInTheDocument();
            // discount
            expect(screen.queryByText("50%")).toBeInTheDocument();
            // discounted prrice
            expect(screen.queryByText("$ 5")).toBeInTheDocument();

            // inStock
            expect(screen.queryByDisplayValue("100")).toBeInTheDocument();

            expect(screen.queryByDisplayValue("test warranty")).toBeInTheDocument();
            expect(screen.queryByDisplayValue("test description")).toBeInTheDocument();

            expect(screen.queryByText("test category 1")).toBeInTheDocument();
            expect(screen.queryByText("test category 2")).toBeInTheDocument();
        });

        it("shouldn't display the discounted price when the discount is 0", () => {
            renderProductForm(0);

            // price
            expect(screen.queryByDisplayValue("10")).toBeInTheDocument();
            // discount
            expect(screen.queryByText("0%")).toBeInTheDocument();
            // discounted prrice
            expect(screen.queryByText("$ 5")).not.toBeInTheDocument();
        });
    });

    describe("discount component", () => {
        it("should activate the discount input when we click on the discount", () => {
            renderProductForm();
            fireEvent.click(screen.getByText("50%"));
            expect(screen.queryByTestId("product-form-discount-input")).toBeInTheDocument();
        });

        it("should deactivate the discount input when we remove the focus from the input", () => {
            renderProductForm();
            fireEvent.click(screen.getByText("50%"));
            fireEvent.blur(screen.getByTestId("product-form-discount-input"));
            expect(screen.queryByTestId("product-form-discount-input")).not.toBeInTheDocument();
        });

        it("should set the discount to 0 when the input value is less than 0", () => {
            const { discountHandler } = renderProductForm();
            fireEvent.click(screen.getByText("50%"));

            const input = screen.getByTestId("product-form-discount-input");
            fireEvent.change(input, { target: { value: "-5" } });

            expect(discountHandler.setValue).toHaveBeenCalledWith(0);
        });

        it("should set the discount to 100 when the input value is greater than 100", () => {
            const { discountHandler } = renderProductForm();
            fireEvent.click(screen.getByText("50%"));

            const input = screen.getByTestId("product-form-discount-input");
            fireEvent.change(input, { target: { value: "1024" } });

            expect(discountHandler.setValue).toHaveBeenCalledWith(100);
        });

    });

    describe("form validation", () => {
        const windowScrollMock = jest.spyOn(window, "scroll");

        beforeEach(() => {
            windowScrollMock.mockReset();
        });

        it("should call window.scroll and handleOnSubmit", () => {
            const { handleOnSubmit } =renderProductForm();
            fireEvent.click(screen.queryByText("Save Changes"));

            expect(windowScrollMock).toHaveBeenCalledWith(0, 0);
            expect(handleOnSubmit).toHaveBeenCalled();
        });

        it("shouldn't call handleOnSubmit when an error appears", () => {
            const { titleHandler, handleOnSubmit } =renderProductForm();
            titleHandler.value = "";

            fireEvent.click(screen.queryByText("Save Changes"));
            expect(handleOnSubmit).not.toHaveBeenCalled();
        });


        it("should set a 'title is required error'", () => {
            const { titleHandler } = renderProductForm();
            titleHandler.value = "";

            fireEvent.click(screen.queryByText("Save Changes"));
            expect(titleHandler.setError).toHaveBeenCalledWith("The title is required");
        });

        it("should set a 'price is required error'", () => {
            const { priceHandler } = renderProductForm();
            priceHandler.value = "";

            fireEvent.click(screen.queryByText("Save Changes"));
            expect(priceHandler.setError).toHaveBeenCalledWith("The price is required");
        });

        it("should set a 'stock is required error'", () => {
            const { inStockHandler } = renderProductForm();
            inStockHandler.value = "";

            fireEvent.click(screen.queryByText("Save Changes"));
            expect(inStockHandler.setError).toHaveBeenCalledWith("The stock is required");
        });

        it("should set a 'warranty is required error'", () => {
            const { warrantyHandler } = renderProductForm();
            warrantyHandler.value = "";

            fireEvent.click(screen.queryByText("Save Changes"));
            expect(warrantyHandler.setError).toHaveBeenCalledWith("The warranty is required");
        });

        it("should set a 'description is required error'", () => {
            const { descriptionHandler } = renderProductForm();
            descriptionHandler.value = "";

            fireEvent.click(screen.queryByText("Save Changes"));
            expect(descriptionHandler.setError).toHaveBeenCalledWith("The description is required");
        });
    });
});
