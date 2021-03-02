import React from "react";

import { fireEvent, render, act } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import AlertsContext from "@/contexts/AlertsContext";

import ApiController from "@/services/ApiController";

import Promotions from "./Promotionns";

jest.mock("@/services/ApiController");

jest.mock("@/components/Dashboard/Layout", () => ({ children }) => children);

jest.mock("./AddPromotion", () => ({ isActive }) => {
    if(!isActive) return null;

    return "The add promotion is active";
});

jest.mock("./EditPromotion", () => ({ promotion, isActive }) => {
    if(!isActive) return null;

    return (
        <div data-testid="edit-promotion">
            <span>Id: { promotion._id }</span>
            <span>Title: { promotion.title }</span>
            <span>Link: { promotion.link }</span>
        </div>
    );
});

const PROMOTIONS_MOCK = [
    {
        _id: "testid1",
        title: "test title 1",
        link: "test link 1",
        image: "test-1.webp"
    },
    {
        _id: "testid2",
        title: "test title 2",
        link: "test link 2",
        image: "test-2.webp"
    },
    {
        _id: "testid3",
        title: "test title 3",
        link: "test link 3",
        image: "test-3.webp"
    }
];

const mockedAPIDelete = mocked(ApiController.delete);

describe("@/domain/Dashboard/Management/Promotions", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should render correctly", () => {
        const { queryByText, getAllByAltText } = render(
            <Promotions
                promotions={PROMOTIONS_MOCK}
            />
        );

        const images = getAllByAltText("Promotion Image") as HTMLImageElement[];

        PROMOTIONS_MOCK.forEach((promotion, index) => {
            expect(queryByText(promotion.title)).toBeInTheDocument();

            expect(images[index].src).toMatch(`/img/promotions/medium-${promotion.image}`);
        });
    });

    it("should activate the AddPromotion form", () => {
        const { queryByText, getByTestId } = render(
            <Promotions
                promotions={PROMOTIONS_MOCK}
            />
        );

        fireEvent.click(getByTestId("promotions-add-button"));

        expect(queryByText("The add promotion is active")).toBeInTheDocument();
    });

    it("should activate the EditPromotion form", () => {
        const { queryByText, getAllByTestId } = render(
            <Promotions
                promotions={PROMOTIONS_MOCK}
            />
        );

        const editButtons = getAllByTestId("promotion-edit-button");

        fireEvent.click(editButtons[1]);

        expect(queryByText("Id: testid2")).toBeInTheDocument();
        expect(queryByText("Title: test title 2")).toBeInTheDocument();
        expect(queryByText("Link: test link 2")).toBeInTheDocument();
    });

    describe("delete promotion", () => {
        it("should call the api and delete a promotion", async () => {
            const { queryByText, getByText, getAllByTestId } = render(
                <Promotions
                    promotions={PROMOTIONS_MOCK}
                />
            );

            const deleteButtons = getAllByTestId("promotion-delete-button");
            fireEvent.click(deleteButtons[0]);
            
            mockedAPIDelete.mockResolvedValue({
                data: {
                    deletedPromotion: PROMOTIONS_MOCK[0]
                }
            });

            await act(async () => fireEvent.click(getByText("Yes")));

            expect(mockedAPIDelete).toHaveBeenCalledWith("promotions/testid1");

            expect(queryByText("test title 1")).not.toBeInTheDocument();
        }); 

        it("should create an error alert when the api returns an error", async () => {
            const createAlertMock = jest.fn();

            const { getByText, getAllByTestId } = render(
                <AlertsContext.Provider value={{ createAlert: createAlertMock }}>
                    <Promotions
                        promotions={PROMOTIONS_MOCK}
                    />
                </AlertsContext.Provider>
            );

            const deleteButtons = getAllByTestId("promotion-delete-button");
            fireEvent.click(deleteButtons[0]);
            
            mockedAPIDelete.mockResolvedValue({
                error: "test error",
                message: "test message"
            });

            await act(async () => fireEvent.click(getByText("Yes")));

            expect(createAlertMock).toHaveBeenCalledWith("danger", "test message");
        }); 
    });
});
