import React from "react";

import { render, fireEvent, screen, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import AddPromotion from "./AddPromotion";

jest.mock("@/services/ApiController");

const PROMOTION_MOCK = {
    title: "test title",
    link: "test link",
    image: "test.webp"
}

const IMAGE_MOCK = new File([], "test.webp", {
    type: "image/webp"
});

const setInputValue = (inputName: string, value: string ) => {
    const input = screen.getByLabelText(inputName);
    fireEvent.change(input, { target: { value } });
}

URL.createObjectURL = () => "";

const mockedAPIPost = mocked(ApiController.post);

describe("@/domain/Dashboard/Management/Promotions/AddPromotion", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should call the api and create a promotion", async () => {
        const createAlertMock = jest.fn();
        const setPromotionsMock = jest.fn();
        const setIsActiveMock = jest.fn();

        const { getByText, getByTestId } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <AddPromotion setPromotions={setPromotionsMock} isActive={true} setIsActive={setIsActiveMock}/>
            </AlertsContext.Provider>
        );

        setInputValue("Title", "test title");
        setInputValue("Link", "test link");

        fireEvent.change(getByTestId("image-selector-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        mockedAPIPost.mockResolvedValue({
            data: {
                createdPromotion: PROMOTION_MOCK
            }
        });

        await act(async () => fireEvent.click(getByText("Save")));

        const postCall = mockedAPIPost.mock.calls[0];
        expect(postCall[0]).toBe("promotions");

        const formData = postCall[1].formData;
        expect(formData.get("title")).toBe("test title");
        expect(formData.get("link")).toBe("test link");
        expect(formData.get("image")).toEqual(IMAGE_MOCK);

        const setPromotionsFunction = setPromotionsMock.mock.calls[0][0];
        expect(setPromotionsFunction([])).toEqual([PROMOTION_MOCK]);

        expect(setIsActiveMock).toHaveBeenCalledWith(false);
        expect(createAlertMock).toHaveBeenCalledWith("success", "The promotion has been created successfully");
    });

    it("should create an error alert when the image doesn't exist", () => {
        const createAlertMock = jest.fn();

        const { getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <AddPromotion setPromotions={jest.fn()} isActive={true} setIsActive={jest.fn()}/>
            </AlertsContext.Provider>
        );

        setInputValue("Title", "test title");
        setInputValue("Link", "test link");

        fireEvent.click(getByText("Save"));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "The image is required");
    });

    it("should create an error alert when the api returns an error", async () => {
        const createAlertMock = jest.fn();

        const { getByText, getByTestId } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <AddPromotion setPromotions={jest.fn()} isActive={true} setIsActive={jest.fn()}/>
            </AlertsContext.Provider>
        );

        setInputValue("Title", "test title");
        setInputValue("Link", "test link");

        fireEvent.change(getByTestId("image-selector-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        mockedAPIPost.mockResolvedValue({
            error: "test error",
            message: "test message"
        });

        await act(async () => fireEvent.click(getByText("Save")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test message");
    });
});
