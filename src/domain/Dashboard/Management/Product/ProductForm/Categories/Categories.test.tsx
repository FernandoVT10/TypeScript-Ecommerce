import React from "react";
import { mocked } from "ts-jest/utils";

import { render, fireEvent, act, screen } from "@testing-library/react";

import ApiController from "@/services/ApiController";

import Categories from "./Categories";

const CATEGORIES_MOCK = [
    { _id: "id-1", name: "test 1" },
    { _id: "id-2", name: "test 2" },
    { _id: "id-3", name: "test 3" },
    { _id: "id-4", name: "test 4" }
];

jest.mock("@/services/ApiController");

const mockedAPIGet = mocked(ApiController.get);
const mockedAPIPost = mocked(ApiController.post);
const mockedAPIDelete = mocked(ApiController.delete);

describe("@/domain/Dashboard/Management/Product/ProductForm/Categories", () => {
    beforeEach(() => {
        mockedAPIGet.mockReset();
        mockedAPIPost.mockReset();
        mockedAPIDelete.mockReset();

        mockedAPIGet.mockImplementation(() =>  Promise.resolve({
            data: { categories: CATEGORIES_MOCK }
        }));
    });

    it("should call the api and render the categories correclty", async () => {
        await act(async () => render(
            <Categories selectedCategories={[]} setSelectedCategories={jest.fn()}/>
        ));

        CATEGORIES_MOCK.forEach(category => {
            expect(screen.queryByText(category.name)).toBeInTheDocument();
        });

        expect(mockedAPIGet).toHaveBeenCalledWith("categories");
    });
    
    it("should call setSelectedCategories with a new category", async () => {
        const setSelectedCategoriesMock = jest.fn();

        await act(async () => render(
            <Categories
                selectedCategories={[]}
                setSelectedCategories={setSelectedCategoriesMock}
            />
        ));

        const category = screen.getByText("test 1");
        fireEvent.click(category.parentElement);

        const setSelectedCategoriesFunction = setSelectedCategoriesMock.mock.calls[0][0];
        expect(setSelectedCategoriesFunction(["test 4"])).toEqual(["test 4", "test 1"]);
    });
    
    it("should call setSelectedCategories with one category less", async () => {
        const setSelectedCategoriesMock = jest.fn();
        const selectedCategoriesMock = ["test 1", "test 4"];

        await act(async () => render(
            <Categories
                selectedCategories={selectedCategoriesMock}
                setSelectedCategories={setSelectedCategoriesMock}
            />
        ));

        const category = screen.getByText("test 1");
        fireEvent.click(category.parentElement);

        expect(setSelectedCategoriesMock).toHaveBeenCalledWith(["test 4"]);
    });
    
    it("should call the api and delete a category", async () => {
        await act(async () => render(
            <Categories selectedCategories={[]} setSelectedCategories={jest.fn()}/>
        ));

        mockedAPIDelete.mockImplementation(() => Promise.resolve({
            data: {
                deletedCategory: CATEGORIES_MOCK[2]
            }
        }));

        const categoryParent = screen.getByText("test 3").parentElement;
        const deleteButton = categoryParent.children[1];
        await act(async () => fireEvent.click(deleteButton));

        expect(screen.queryByText("test 3")).not.toBeInTheDocument();

        expect(mockedAPIDelete).toHaveBeenCalledWith("categories/id-3");
    });
    
    it("should activate and deactivate the add category form", async () => {
        await act(async () => render(
            <Categories selectedCategories={[]} setSelectedCategories={jest.fn()}/>
        ));

        expect(screen.queryByTestId("add-category-input")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Add new category"));

        expect(screen.queryByTestId("add-category-input")).toBeInTheDocument();
    });
    
    it("should call the api and add a category correctly", async () => {
        await act(async () => render(
            <Categories selectedCategories={[]} setSelectedCategories={jest.fn()}/>
        ));

        fireEvent.click(screen.getByText("Add new category"));

        const input = screen.getByTestId("add-category-input");
        fireEvent.change(input, { target: { value: "test category" } });

        mockedAPIPost.mockImplementation(() => Promise.resolve({
            data: {
                createdCategory: { _id: "id-5", name: "test category" }
            }
        }));

        await act(async () => fireEvent.submit(input.parentElement));

        expect(screen.queryByText("test category")).toBeInTheDocument();

        expect(mockedAPIPost).toHaveBeenCalledWith("categories", {
            body: { name: "test category" }
        });
    });

    
    it("should search a category correctly", async () => {
        await act(async () => render(
            <Categories selectedCategories={[]} setSelectedCategories={jest.fn()}/>
        ));

        const input = screen.getByPlaceholderText("Search a category");
        fireEvent.change(input, { target: { value: "test 2" } });

        expect(screen.queryByText("test 1")).not.toBeInTheDocument();
        expect(screen.queryByText("test 3")).not.toBeInTheDocument();
        expect(screen.queryByText("test 4")).not.toBeInTheDocument();
        expect(screen.queryByText("test 2")).toBeInTheDocument();
    });
});
