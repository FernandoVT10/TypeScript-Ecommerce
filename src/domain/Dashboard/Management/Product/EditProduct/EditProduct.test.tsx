import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, render, act, screen } from "@testing-library/react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import EditProduct from "./EditProduct";

jest.mock("@/components/Dashboard/Layout", () => ({ children }) => children);
jest.mock("@/services/ApiController");

window.scroll = jest.fn();

const CATEGORIES_MOCK = [
    { _id: "test-1", name: "test category 1" },
    { _id: "test-2", name: "test category 2" },
    { _id: "test-3", name: "test category 3" }
];

const PRODUCT_MOCK = {
    _id: "test id",
    images: ["test-1.jpg", "test-2.jpg"],
    title: "test title",
    price: 250,
    discount: 50,
    inStock: 100,
    warranty: "test warranty",
    description: "test description",
    categories: [
        { name: "test category 1" }
    ]
}

const IMAGE_MOCK = new File([], "test.jpg", {
    type: "image/jpeg"
});

const FILE_LIST_MOCK = {
    0: IMAGE_MOCK,
    item: () => IMAGE_MOCK,
    length: 1
}

const mockedAPIGet = mocked(ApiController.get);
const mockedAPIPut = mocked(ApiController.put);


describe("@/domain/Dashboard/Management/Product/EditProduct", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
        mockedAPIPut.mockReset();

        mockedAPIGet.mockImplementation(() => Promise.resolve({
            data: {
                categories: CATEGORIES_MOCK
            }
        }));

        mockedAPIPut.mockImplementation(() => Promise.resolve({}));
    });

    it("should call the api correclty", async () => {
        await act(async () => render(<EditProduct product={PRODUCT_MOCK}/>));

        fireEvent.click(screen.getByText("test category 3").parentElement);

        // add an image
        await act(async () => fireEvent.change(
            screen.getByTestId("carousel-file-input"), { target: { files: FILE_LIST_MOCK } }
        ));

        // remove an image
        const removeButtons = screen.getAllByTestId("carousel-remove-image-button");
        await act(async () => fireEvent.click(removeButtons[1]));

        await act(async () => fireEvent.click(screen.getByText("Save Changes")));

        const urlCall = mockedAPIPut.mock.calls[0][0];
        expect(urlCall).toBe("products/test id");

        const formData = mockedAPIPut.mock.calls[0][1].formData;

        expect(formData.get("title")).toBe("test title");
        expect(formData.get("price")).toBe("250");
        expect(formData.get("discount")).toBe("50");
        expect(formData.get("inStock")).toBe("100");
        expect(formData.get("warranty")).toBe("test warranty");
        expect(formData.get("description")).toBe("test description");

        expect(formData.getAll("deletedImages")).toEqual(["test-2.jpg"]);
        expect(formData.getAll("newImages")).toEqual([IMAGE_MOCK]);
        expect(formData.getAll("categories")).toEqual(["test category 1", "test category 3"]);
    });

    it("should add an alert when the api return an error", async () => {
        const createAlertMock = jest.fn();

        await act(async () => render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditProduct product={PRODUCT_MOCK}/>
            </AlertsContext.Provider>
        ));

        mockedAPIPut.mockImplementation(() => Promise.resolve({
            error: "test error",
            message: "test message"
        }));

        await act(async () => fireEvent.click(screen.getByText("Save Changes")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test message");
    });
});
