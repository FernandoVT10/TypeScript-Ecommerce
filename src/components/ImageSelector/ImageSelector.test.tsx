import React from "react";

import { fireEvent, render } from "@testing-library/react";

import ImageSelector from "./ImageSelector";

const IMAGE_MOCK = new File([], "test.webp", {
    type: "image/webp"
});

URL.createObjectURL = () => "test-image.webp";

describe("@/components/ImageSelector", () => {
    it("should render correclty", () => {
        const { getByAltText } = render(
            <ImageSelector prefix="test" imageUrl="img/test.webp" setNewImage={jest.fn()}/>
        );

        const image = getByAltText("Preview Image") as HTMLImageElement;
        expect(image.src).toMatch("img/test.webp");
    });

    it("should render correclty when the imageUrl is null", () => {
        const { queryByAltText, getByTestId } = render(
            <ImageSelector prefix="test" imageUrl="" setNewImage={jest.fn()}/>
        );

        expect(queryByAltText("Preview Image")).not.toBeInTheDocument();

        const label = getByTestId("image-selector-label");
        expect(label.classList).toContain("withoutImage")
    });

    it("should call setNewImage and add the image preview when we drop an image in the droparea", () => {
        const setNewImageMock = jest.fn();

        const { getByAltText,  getByTestId } = render(
            <ImageSelector prefix="test" imageUrl="" setNewImage={setNewImageMock}/>
        );

        const label = getByTestId("image-selector-label");
        fireEvent.drop(label, { dataTransfer: { files: [IMAGE_MOCK] } });

        const image = getByAltText("Preview Image") as HTMLImageElement;
        expect(image.src).toMatch("test-image.webp");

        expect(setNewImageMock).toHaveBeenCalledWith(IMAGE_MOCK);
    });
});
