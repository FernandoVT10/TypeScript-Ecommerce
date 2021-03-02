import React from "react";

import { fireEvent, render, act, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import ApiController from "@/services/ApiController";

import EditPromotion from "./EditPromotion";
import AlertsContext from "@/contexts/AlertsContext";

jest.mock("@/services/ApiController");

const PROMOTION_MOCK = {
    _id: "testid",
    title: "test title",
    link: "test link",
    image: "test.webp"
}

const UPDATED_PROMOTION_MOCK = {
    _id: "testid",
    title: "updated title",
    link: "updated link",
    image: "updated.webp"
}

const IMAGE_MOCK = new File([], "updated.webp", {
    type: "image/webp"
});

const changeInputValue = (labelName: string, value: string) => {
    const input = screen.getByLabelText(labelName);
    fireEvent.change(input, { target: { value } });
}

const mockedAPIPut = mocked(ApiController.put);

URL.createObjectURL = () => "";

describe("@/domain/Dashboard/Management/Promotions/EditPromotion", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render correctly", () => {
        const { queryByDisplayValue, getByAltText } = render(
            <EditPromotion
                promotion={PROMOTION_MOCK}
                setPromotions={jest.fn()}
                isActive={true}
                setIsActive={jest.fn()}
            />
        );

        expect(queryByDisplayValue("test title")).toBeInTheDocument();
        expect(queryByDisplayValue("test link")).toBeInTheDocument();

        const image = getByAltText("Preview Image") as HTMLImageElement;
        expect(image.src).toMatch("/img/promotions/medium-test.webp");
    });

    it("should call the api and update a promotion", async () => {
        const setPromotionsMock = jest.fn();
        const setIsActiveMock = jest.fn();
        const createAlertMock = jest.fn();

        const { getByTestId, getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditPromotion
                    promotion={PROMOTION_MOCK}
                    setPromotions={setPromotionsMock}
                    isActive={true}
                    setIsActive={setIsActiveMock}
                />
            </AlertsContext.Provider>
        );

        changeInputValue("Title", "updated title");
        changeInputValue("Link", "updated link");
        fireEvent.change(getByTestId("image-selector-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        mockedAPIPut.mockResolvedValue({
            data: {
                updatedPromotion: UPDATED_PROMOTION_MOCK
            }
        });

        await act(async () => fireEvent.click(getByText("Save")));

        const putCall = mockedAPIPut.mock.calls[0];
        expect(putCall[0]).toBe("promotions/testid");

        const formData = putCall[1].formData;
        expect(formData.get("title")).toBe("updated title");
        expect(formData.get("link")).toBe("updated link");
        expect(formData.get("newImage")).toEqual(IMAGE_MOCK);

        const setPromotionsFunction = setPromotionsMock.mock.calls[0][0];
        expect(setPromotionsFunction([PROMOTION_MOCK])).toEqual([UPDATED_PROMOTION_MOCK]);

        expect(setIsActiveMock).toHaveBeenCalledWith(false);
        expect(createAlertMock).toHaveBeenCalledWith("success", "The promotion has been edited successfully");
    });

    it("should create an error alert when the api returns an error", async () => {
        const createAlertMock = jest.fn();

        const { getByText } = render(
            <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                <EditPromotion
                    promotion={PROMOTION_MOCK}
                    setPromotions={jest.fn()}
                    isActive={true}
                    setIsActive={jest.fn()}
                />
            </AlertsContext.Provider>
        );

        mockedAPIPut.mockResolvedValue({
            error: "test error",
            message: "test message"
        });

        await act(async () => fireEvent.click(getByText("Save")));

        expect(createAlertMock).toHaveBeenCalledWith("danger", "test message");
    });
});
