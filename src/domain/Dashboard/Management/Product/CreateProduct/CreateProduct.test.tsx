import React from "react";
import { mocked } from "ts-jest/utils";

import { render, screen, act, fireEvent } from "@testing-library/react";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import CreateProduct from "./CreateProduct";

jest.mock("@/components/Dashboard/Layout", () => ({ children }) => children);
jest.mock("@/services/ApiController");

window.scroll = jest.fn();

const CATEGORIES_MOCK = [
    { _id: "test-1", name: "test category 1" },
    { _id: "test-2", name: "test category 2" },
    { _id: "test-3", name: "test category 3" }
];

const IMAGE_MOCK = new File([], "test.jpg", {
    type: "image/jpeg"
});

const FILE_LIST_MOCK = {
    0: IMAGE_MOCK,
    item: () => IMAGE_MOCK,
    length: 1
}

const mockedAPIGet = mocked(ApiController.get);
const mockedAPIPost = mocked(ApiController.post);

const changeInputValue = (label: string, value: string) => {
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value } });
}

describe("@/domain/Dashbaord/Management/Product/CreateProduct", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
        mockedAPIPost.mockReset();

        mockedAPIGet.mockImplementation(() => Promise.resolve({
            data: {
                categories: CATEGORIES_MOCK
            }
        }));

        mockedAPIPost.mockImplementation(() => Promise.resolve({}));
    });

    it("should call the api correclty", async () => {
        const routerPushMock = jest.fn();

        changeRouterProperties({
            push: routerPushMock
        });

        await act(async () => render(<CreateProduct/>));

        changeInputValue("Title", "test title");
        changeInputValue("Price", "250");
        changeInputValue("In Stock", "100");
        changeInputValue("Warranty", "test warranty");
        changeInputValue("Description", "test description");

        fireEvent.click(screen.getByText("test category 1").parentElement);
        fireEvent.click(screen.getByText("test category 3").parentElement);

        // add an image
        await act(async () => fireEvent.change(
            screen.getByTestId("carousel-file-input"), { target: { files: FILE_LIST_MOCK } }
        ));

        await act(async () => fireEvent.click(screen.getByText("Save Changes")));

        const urlCall = mockedAPIPost.mock.calls[0][0];
        expect(urlCall).toBe("products");

        const formData = mockedAPIPost.mock.calls[0][1].formData;

        expect(formData.get("title")).toBe("test title");
        expect(formData.get("price")).toBe("250");
        expect(formData.get("discount")).toBe("0");
        expect(formData.get("inStock")).toBe("100");
        expect(formData.get("warranty")).toBe("test warranty");
        expect(formData.get("description")).toBe("test description");

        expect(formData.getAll("images")).toEqual([IMAGE_MOCK]);
        expect(formData.getAll("categories")).toEqual(["test category 1", "test category 3"]);

        expect(routerPushMock).toHaveBeenCalledWith("/dashboard/management/products/");
    });

    it("should add an alert with a 'An image is required' error", async () => {
        const createAlertMock = jest.fn();

        await act(async () => render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <CreateProduct/>
            </AlertsContext.Provider> 
        ));

        changeInputValue("Title", "test title");
        changeInputValue("Price", "250");
        changeInputValue("In Stock", "100");
        changeInputValue("Warranty", "test warranty");
        changeInputValue("Description", "test description");

        await act(async () => fireEvent.click(screen.getByText("Save Changes")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "An image is required");
    });

    it("should add an alert when the api return an error", async () => {
        const createAlertMock = jest.fn();

        await act(async () => render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <CreateProduct/>
            </AlertsContext.Provider> 
        ));

        changeInputValue("Title", "test title");
        changeInputValue("Price", "250");
        changeInputValue("In Stock", "100");
        changeInputValue("Warranty", "test warranty");
        changeInputValue("Description", "test description");

        // add an image
        await act(async () => fireEvent.change(
            screen.getByTestId("carousel-file-input"), { target: { files: FILE_LIST_MOCK } }
        ));

        mockedAPIPost.mockImplementation(() => Promise.resolve({
            error: "test error",
            message: "test message"
        }));

        await act(async () => fireEvent.click(screen.getByText("Save Changes")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test message");
    });
});
