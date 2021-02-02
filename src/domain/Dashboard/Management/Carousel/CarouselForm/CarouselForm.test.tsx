import React from "react";

import { fireEvent, render } from "@testing-library/react";

import CarouselForm from "./CarouselForm";

const IMAGE_MOCK = new File([], "test.webp", {
    type: "image/webp"
});

URL.createObjectURL = jest.fn(() => "test-data-image");

describe("@/domain/Dashboard/Mannagement/Carousel/CarouselForm", () => {
    it("should render correclty", () => {
        const { queryByDisplayValue, getByAltText } = render(
            <CarouselForm
                isEditing={true}
                setIsEditing={jest.fn()}
                image="test.jpg"
                setImage={jest.fn()}
                link="https://example.com"
                setLink={jest.fn()}
                onSubmit={jest.fn()}
                prefix="testing"
                loading={false}
            />
        );

        const previewImage = getByAltText("Preview Image") as HTMLImageElement;
        expect(previewImage.src).toMatch("/img/carousel/medium-test.jpg");

        expect(queryByDisplayValue("https://example.com")).toBeInTheDocument();
    });

    it("should call setImage and show the image preview", () => {
        const setImageMock = jest.fn();

        const { getByTestId, getByAltText } = render(
            <CarouselForm
                isEditing={true}
                setIsEditing={jest.fn()}
                image="test.jpg"
                setImage={setImageMock}
                link="https://example.com"
                setLink={jest.fn()}
                onSubmit={jest.fn()}
                prefix="testing"
                loading={false}
            />
        );

        fireEvent.change(getByTestId("carousel-form-input-file"), {
            target: { files: [IMAGE_MOCK] }
        });

        const previewImage = getByAltText("Preview Image") as HTMLImageElement;
        expect(previewImage.src).toMatch("test-data-image");

        expect(setImageMock).toHaveBeenCalledWith(IMAGE_MOCK);
    });

    it("should call onSubmit", () => {
        const onSubmitMock = jest.fn();

        const { getByText } = render(
            <CarouselForm
                isEditing={true}
                setIsEditing={jest.fn()}
                image="test.jpg"
                setImage={jest.fn()}
                link="https://example.com"
                setLink={jest.fn()}
                onSubmit={onSubmitMock}
                prefix="testing"
                loading={false}
            />
        );

        fireEvent.click(getByText("Save"));

        expect(onSubmitMock).toHaveBeenCalled();
    });
});
