import React from "react";

import { fireEvent, render } from "@testing-library/react";

import PromotionForm from "./PromotionForm";

describe("@/domain/Dashboard/Management/Promotions/PromotionForm", () => {
    it("should render correctly", () => {
        const { queryByDisplayValue, getByAltText } = render(
            <PromotionForm
                title="test title"
                setTitle={jest.fn()}
                link="test link"
                setLink={jest.fn()}
                image="test.webp"
                setNewImage={jest.fn()}
                isActive={true}
                setIsActive={jest.fn()}
                onSubmit={jest.fn()}
                prefix="test"
                loading={false}
            />
        );

        expect(queryByDisplayValue("test title")).toBeInTheDocument();
        expect(queryByDisplayValue("test link")).toBeInTheDocument();

        const image = getByAltText("Preview Image") as HTMLImageElement;
        expect(image.src).toMatch("/img/promotions/medium-test.webp");
    });

    it("should call setIsActive when we click on the cancel button", () => {
        const setIsActiveMock = jest.fn();

        const { getByText } = render(
            <PromotionForm
                title="test title"
                setTitle={jest.fn()}
                link="test link"
                setLink={jest.fn()}
                image="test.webp"
                setNewImage={jest.fn()}
                isActive={true}
                setIsActive={setIsActiveMock}
                onSubmit={jest.fn()}
                prefix="test"
                loading={false}
            />
        );

        fireEvent.click(getByText("Cancel"));

        expect(setIsActiveMock).toHaveBeenCalledWith(false);
    });


    it("should call onSubmit when we click on the save button", () => {
        const onSubmitMock = jest.fn();

        const { getByText } = render(
            <PromotionForm
                title="test title"
                setTitle={jest.fn()}
                link="test link"
                setLink={jest.fn()}
                image="test.webp"
                setNewImage={jest.fn()}
                isActive={true}
                setIsActive={jest.fn()}
                onSubmit={onSubmitMock}
                prefix="test"
                loading={false}
            />
        );

        fireEvent.click(getByText("Save"));

        expect(onSubmitMock).toHaveBeenCalled();
    });
});
