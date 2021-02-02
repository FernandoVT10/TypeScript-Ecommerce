import React from "react";

import { fireEvent, render, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import EditCarousel from "./EditCarousel";

jest.mock("@/services/ApiController");

const IMAGE_MOCK = new File([], "newImage.webp", {
    type: "image/webp"
});

const CAROUSEL_ITEM_MOCK = {
    _id: "testid",
    link: "https://example.com",
    image: "test.webp"
}

const mockedAPIPut = mocked(ApiController.put);

URL.createObjectURL = () => "data-image";

describe("@/domain/Dashboard/Management/Carousel/EditCarousel", () => {
    beforeEach(() => {
        mockedAPIPut.mockReset();

        mockedAPIPut.mockResolvedValue({
            data: {
                updatedCarouselItem: {
                    _id: "testid",
                    link: "https://updated.com",
                    image: "newImage.webp"
                }
            }
        });
    });

    it("should render correctly", async () => {
        const createAlertMock = jest.fn();

        const { queryByDisplayValue, getByAltText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditCarousel
                    isEditing={true}
                    setIsEditing={jest.fn()}
                    carouselItem={CAROUSEL_ITEM_MOCK}
                    setCarouselItems={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        const preview = getByAltText("Preview Image") as HTMLInputElement;
        expect(preview.src).toMatch("test.webp");

        expect(queryByDisplayValue("https://example.com")).toBeInTheDocument();
    });

    it("should call the api and edit a carousel item", async () => {
        const createAlertMock = jest.fn();
        const setCarouselItemsMock = jest.fn();
        const setIsEditingMock = jest.fn();

        const { getByLabelText, getByTestId, getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditCarousel
                    isEditing={true}
                    setIsEditing={setIsEditingMock}
                    carouselItem={CAROUSEL_ITEM_MOCK}
                    setCarouselItems={setCarouselItemsMock}
                />
            </AlertsContext.Provider>
        );

        fireEvent.change(getByLabelText("Link"), { target: { value: "https://updated.com" } });
        fireEvent.change(getByTestId("carousel-form-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        await act(async () => fireEvent.click(getByText("Save")));

        const putCall = mockedAPIPut.mock.calls[0];
        expect(putCall[0]).toBe("carousel/testid");

        const formData = putCall[1].formData;
        expect(formData.get("link")).toBe("https://updated.com");
        expect(formData.get("newImage")).toEqual(IMAGE_MOCK);

        const setCarouselItemsFunction = setCarouselItemsMock.mock.calls[0][0];
        expect(setCarouselItemsFunction([CAROUSEL_ITEM_MOCK])).toEqual([
            {
                _id: "testid",
                link: "https://updated.com",
                image: "newImage.webp"
            }
        ]);

        expect(createAlertMock).toHaveBeenCalledWith("success", "The carousel item has been updated successfully");

        expect(setIsEditingMock).toHaveBeenCalledWith(false);
    });

    it("should call the api and edit a carousel item without an image", async () => {
        const createAlertMock = jest.fn();

        const { getByLabelText, getByTestId, getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditCarousel
                    isEditing={true}
                    setIsEditing={jest.fn()}
                    carouselItem={CAROUSEL_ITEM_MOCK}
                    setCarouselItems={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        fireEvent.change(getByLabelText("Link"), { target: { value: "https://updated.com" } });

        await act(async () => fireEvent.click(getByText("Save")));

        const putCall = mockedAPIPut.mock.calls[0];
        expect(putCall[0]).toBe("carousel/testid");

        const formData = putCall[1].formData;
        expect(formData.get("link")).toBe("https://updated.com");
        expect(formData.get("newImage")).toBeNull();
    });

    it("should create an error alert when the api returns an error", async () => {
        const createAlertMock = jest.fn();

        const { getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditCarousel
                    isEditing={true}
                    setIsEditing={jest.fn()}
                    carouselItem={CAROUSEL_ITEM_MOCK}
                    setCarouselItems={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        mockedAPIPut.mockResolvedValue({
            error: "test",
            message: "test error"
        });

        await act(async () => fireEvent.click(getByText("Save")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test error");
    });
});
