import React from "react";
import { mocked } from "ts-jest/utils";

import { fireEvent, render, act } from "@testing-library/react";

import readFileAsDataURL from "@/services/readFileAsDataURL";

import Carousel from "./Carousel";

const IMAGES_MOCK = [
    "test-1.jpg", "test-2.jpg", "test-3.jpg"
];

const IMAGE_MOCK = new File([], "test.jpg", {
    type: "image/jpeg"
});

const FILE_LIST_MOCK = {
    0: IMAGE_MOCK,
    item: () => IMAGE_MOCK,
    length: 1
}

jest.mock("@/services/readFileAsDataURL");

const mockedReadFileAsDataURL = mocked(readFileAsDataURL);

describe("@/domain/Dashboard/Management/Prodduct/ProductForm/Carousel", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockedReadFileAsDataURL.mockImplementation(() => Promise.resolve("image_data_url"));
    });

    it("should render the images correectly", () => {
        const { getAllByAltText } = render(
            <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setDeletedImages={jest.fn()}/>
        );

        const images = getAllByAltText("Carousel Thumb Image") as HTMLImageElement[];

        IMAGES_MOCK.forEach((image, index) => {
            expect(images[index].src).toMatch(`/img/products/thumb-${image}`);
        });
    });

    it("should change the selected image", () => {
        const { getAllByAltText, getByAltText } = render(
            <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setDeletedImages={jest.fn()}/>
        );

        const images = getAllByAltText("Carousel Thumb Image") as HTMLImageElement[];

        const selectedImage = getByAltText("Carousel Selected Image") as HTMLImageElement;
        expect(selectedImage.src).toMatch(`/img/products/medium-test-1.jpg`);

        fireEvent.click(images[2]);

        expect(selectedImage.src).toMatch(`/img/products/medium-test-3.jpg`);
    });

    it("should call setDeletedImages with the image deleted and remove the image", () => {
        const setDeletedImagesMock = jest.fn();

        const { getAllByTestId, queryAllByAltText } = render(
            <Carousel images={IMAGES_MOCK} setNewImages={jest.fn()} setDeletedImages={setDeletedImagesMock}/>
        );

        const removeButtons = getAllByTestId("carousel-remove-image-button");

        fireEvent.click(removeButtons[2]);

        expect(queryAllByAltText("Carousel Thumb Image")).toHaveLength(2);

        const setDeletedImagesFunction = setDeletedImagesMock.mock.calls[0][0];

        expect(setDeletedImagesFunction([])).toEqual(["test-3.jpg"]);
    });

    it("should add an image and call setNewImages", async () => {
        const setNewImagesMock = jest.fn();

        const { getByTestId, getAllByAltText } = render(
            <Carousel images={IMAGES_MOCK} setNewImages={setNewImagesMock} setDeletedImages={jest.fn()}/>
        );

        await act(async () => fireEvent.change(
            getByTestId("carousel-file-input"), { target: { files: FILE_LIST_MOCK } }
        ));

        expect(mockedReadFileAsDataURL).toHaveBeenCalledWith(IMAGE_MOCK);

        const images = getAllByAltText("Carousel Thumb Image") as HTMLImageElement[];
        expect(images[3].src).toMatch("image_data_url");

        const setNewImagesFunction = setNewImagesMock.mock.calls[0][0];
        expect(setNewImagesFunction([])).toEqual([IMAGE_MOCK]);
    });

    it("should add an image when we drop an image into the drop area", async () => {
        const setNewImagesMock = jest.fn();

        const { getByTestId, getAllByAltText } = render(
            <Carousel images={IMAGES_MOCK} setNewImages={setNewImagesMock} setDeletedImages={jest.fn()}/>
        );

        await act(async () => fireEvent.drop(
            getByTestId("carousel-drop-area"), { dataTransfer: { files: FILE_LIST_MOCK } }
        ));

        expect(mockedReadFileAsDataURL).toHaveBeenCalledWith(IMAGE_MOCK);

        const images = getAllByAltText("Carousel Thumb Image") as HTMLImageElement[];
        expect(images[3].src).toMatch("image_data_url");

        const setNewImagesFunction = setNewImagesMock.mock.calls[0][0];
        expect(setNewImagesFunction([])).toEqual([IMAGE_MOCK]);
    });
});
