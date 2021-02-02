import React from "react";

import { fireEvent, render, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import AddCarousel from "./AddCarousel";

jest.mock("@/services/ApiController");

const IMAGE_MOCK = new File([], "test.webp", {
    type: "image/webp"
});

const CAROUSEL_ITEM_MOCK = {
    link: "https://example.com",
    image: "test.webp"
}

const mockedAPIPost = mocked(ApiController.post);

URL.createObjectURL = () => "data-image";

describe("@/domain/Dashboard/Management/Carousel/AddCarousel", () => {
    beforeEach(() => {
        mockedAPIPost.mockReset();

        mockedAPIPost.mockResolvedValue({
            data: {
                createdCarouselItem: CAROUSEL_ITEM_MOCK
            }
        });
    });

    it("should call the api and add a carousel item", async () => {
        const createAlertMock = jest.fn();
        const setCarouselItemsMock = jest.fn();
        const setIsActiveMock = jest.fn();

        const { getByLabelText, getByTestId, getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <AddCarousel
                    isActive={true}
                    setIsActive={setIsActiveMock}
                    setCarouselItems={setCarouselItemsMock}
                />
            </AlertsContext.Provider>
        );

        fireEvent.change(getByLabelText("Link"), { target: { value: "https://example.com" } });
        fireEvent.change(getByTestId("carousel-form-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        await act(async () => fireEvent.click(getByText("Save")));

        const postCall = mockedAPIPost.mock.calls[0];
        expect(postCall[0]).toBe("carousel");

        const formData = postCall[1].formData;
        expect(formData.get("link")).toBe("https://example.com");
        expect(formData.get("image")).toEqual(IMAGE_MOCK);

        const setCarouselItemsFunction = setCarouselItemsMock.mock.calls[0][0];
        expect(setCarouselItemsFunction([])).toEqual([CAROUSEL_ITEM_MOCK]);

        expect(createAlertMock).toHaveBeenCalledWith("success", "The carousel item has been created successfully");

        expect(setIsActiveMock).toHaveBeenCalledWith(false);
    });

    it("should return a 'The image is required' error", async () => {
        const createAlertMock = jest.fn();

        const { getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <AddCarousel
                    isActive={true}
                    setIsActive={jest.fn()}
                    setCarouselItems={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        await act(async () => fireEvent.click(getByText("Save")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "The image is required");
    });

    it("should create an error alert when the api returns an error", async () => {
        const createAlertMock = jest.fn();

        const { getByLabelText, getByTestId, getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <AddCarousel
                    isActive={true}
                    setIsActive={jest.fn()}
                    setCarouselItems={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        fireEvent.change(getByLabelText("Link"), { target: { value: "https://example.com" } });
        fireEvent.change(getByTestId("carousel-form-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        mockedAPIPost.mockResolvedValue({
            error: "test",
            message: "test error"
        });

        await act(async () => fireEvent.click(getByText("Save")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test error");
    });
});
