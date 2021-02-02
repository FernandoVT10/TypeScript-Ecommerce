import React from "react";

import { render, fireEvent, act, queryAllByTestId } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ApiController from "@/services/ApiController";

import Carousel from "./Carousel";

jest.mock("@/components/Dashboard/Layout", () => ({ children }) => children);
jest.mock("@/services/ApiController");

const CAROUSEL_ITEMS_MOCK = [
    {
        _id: "testid",
        link: "https://example-1.com",
        image: "test-1.jpg"
    },
    {
        _id: "testid-2",
        link: "https://example-2.com",
        image: "test-2.jpg"
    },
    {
        _id: "testid-3",
        link: "https://example-3.com",
        image: "test-3.jpg"
    }
];

const mockedAPIDelete = mocked(ApiController.delete);

describe("@/domain/Dashboard/Management/Carousel", () => {
    beforeEach(() => {
        mockedAPIDelete.mockReset();
        mockedAPIDelete.mockResolvedValue({});
    });

    it("should render correctly", () => {
        const { getAllByAltText } = render(<Carousel carouselItems={CAROUSEL_ITEMS_MOCK}/>);

        const images = getAllByAltText("Carousel Item Image") as HTMLImageElement[];
        images.forEach((image, index) => {
            expect(image.src).toMatch(`/img/carousel/medium-${CAROUSEL_ITEMS_MOCK[index].image}`);
        });
    });

    it("should delete a carousel item", async () => {
        const { getAllByTestId, getByText, getAllByAltText } = render(<Carousel carouselItems={CAROUSEL_ITEMS_MOCK}/>);

        const deleteButtons = getAllByTestId("delete-carousel-item");
        fireEvent.click(deleteButtons[1]);

        await act(async () => fireEvent.click(getByText("Yes")));

        expect(mockedAPIDelete).toHaveBeenCalledWith("carousel/testid-2");
        expect(getAllByAltText("Carousel Item Image")).toHaveLength(2);
    });

    it("should open the EditCarousel modal with the correct carousel item", async () => {
        const { getAllByTestId, queryByDisplayValue } = render(<Carousel carouselItems={CAROUSEL_ITEMS_MOCK}/>);

        const editButtons = getAllByTestId("edit-carousel-item");
        fireEvent.click(editButtons[2]);

        expect(queryByDisplayValue("https://example-3.com")).toBeInTheDocument();
    });
});
