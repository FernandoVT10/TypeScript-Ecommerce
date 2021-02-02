import { mocked } from "ts-jest/utils";

import app from "../../app";
import supertest from "supertest";

import { CAROUSEL_IMAGE_SIZES } from "../../utils/imagesSizes";
import { uploadImage, deleteImage, fileFilter } from "../../utils/services/ImageController";

import User from "../../models/User";
import Carousel, { ICarousel } from "../../models/Carousel";

const request = supertest(app);

jest.mock("../../utils/services/ImageController");

setupTestDB("test_carousel_api");
mockAuthentication();

const CAROUSEL_MOCKS = [
    {
        image: "test-1.jpg",
        link: "https://example.com"
    },
    {
        image: "test-2.jpg",
        link: "https://example.com"
    }
];

const LABELS = CAROUSEL_IMAGE_SIZES.map(image => image.label);

const BUFFER = Buffer.from("some text");

const mockedUploadImage = mocked(uploadImage);
const mockedFileFilter = mocked(fileFilter);
const mockedDeleteImage = mocked(deleteImage);

describe("/api/carousel", () => {
    let carouselItemId = "";

    beforeEach(async () => {
        await User.updateOne({}, { permits: "ADMIN" });

        const carouselItems = await Carousel.insertMany(CAROUSEL_MOCKS);
        carouselItemId = carouselItems[0]._id;

        mockedUploadImage.mockReset();
        mockedFileFilter.mockReset();
        mockedDeleteImage.mockReset();

        mockedUploadImage.mockImplementation(() => Promise.resolve("test.webp"));
        mockedFileFilter.mockImplementation((_req, _file, cb) => cb(null, true))
    });

    describe("get all items", () => {
        it("should get all carousel items", async () => {
            const res = await request.get("/api/carousel/getAllItems");

            const carouselItems: ICarousel[] = res.body.data.carousel;

            expect(carouselItems[0].image).toBe("test-1.jpg");
            expect(carouselItems[1].image).toBe("test-2.jpg");
        });
    });

    describe("create", () => {
        it("should create a carousel item", async () => {
            const res = await request.post("/api/carousel/")
                .field("link", "https://example.com")
                .attach("image", BUFFER, "test.webp")
                .set("Authorization", "Bearer token");

            const createdCarouselItem = res.body.data.createdCarouselItem as ICarousel;

            expect(await Carousel.exists({ _id: createdCarouselItem._id })).toBeTruthy();

            expect(createdCarouselItem.image).toBe("test.webp");
            expect(createdCarouselItem.link).toBe("https://example.com");

            expect(mockedUploadImage).toHaveBeenCalledWith(expect.anything(), CAROUSEL_IMAGE_SIZES, "/carousel/");
        });

        it("should return an error when the image doesn't exist", async () => {
            const res = await request.post("/api/carousel/")
                .field("link", "https://example.com")
                .set("Authorization", "Bearer token");

            expect(res.body).toEqual({
                status: 400,
                error: "Bad Request",
                message: "The image is required",
                path: "/api/carousel/"
            });
        });
    });

    describe("update", () => {
        it("should update a carousel item", async () => {
            const res = await request.put(`/api/carousel/${carouselItemId}`)
                .field("link", "https://example.com")
                .attach("newImage", BUFFER, "test.webp")
                .set("Authorization", "Bearer token");

            const updatedCarouselItem = res.body.data.updatedCarouselItem as ICarousel;

            expect(updatedCarouselItem.link).toBe("https://example.com");
            expect(updatedCarouselItem.image).toBe("test.webp");

            expect(mockedDeleteImage).toHaveBeenCalledWith("test-1.jpg", LABELS, "/carousel/");
            expect(mockedUploadImage).toHaveBeenCalledWith(expect.anything(), CAROUSEL_IMAGE_SIZES, "/carousel/");
        });

        it("should update a carousel item without the newImage", async () => {
            const res = await request.put(`/api/carousel/${carouselItemId}`)
                .field("link", "https://example.com")
                .set("Authorization", "Bearer token");

            const updatedCarouselItem = res.body.data.updatedCarouselItem as ICarousel;

            expect(updatedCarouselItem.link).toBe("https://example.com");
            expect(updatedCarouselItem.image).toBe("test-1.jpg");

            expect(mockedDeleteImage).not.toHaveBeenCalled();
            expect(mockedUploadImage).not.toHaveBeenCalled();
        });

        it("should return an error when the carousel item doesn't exist", async () => {
            const res = await request.put(`/api/carousel/abcdefabcdefabcdefabcdef`)
                .field("link", "https://example.com")
                .set("Authorization", "Bearer token");

            expect(res.body).toEqual({
                status: 404,
                error: "Carousel Item not found",
                message: "The carousel item 'abcdefabcdefabcdefabcdef' doesn't exist",
                path: "/api/carousel/abcdefabcdefabcdefabcdef"
            });
        });
    });

    describe("delete", () => {
        it("should delete a carousel item", async () => {
            const res = await request.delete(`/api/carousel/${carouselItemId}`).set("Authorization", "Bearer token");

            const deletedCarouselItem = res.body.data.deletedCarouselItem as ICarousel;

            expect(await Carousel.exists({ _id: deletedCarouselItem._id })).toBeFalsy();
            expect(mockedDeleteImage).toHaveBeenCalledWith("test-1.jpg", LABELS, "/carousel/");
        });

        it("should return an error when the carousel item doesn't exist", async () => {
            const res = await request.delete(`/api/carousel/abcdefabcdefabcdefabcdef`).set("Authorization", "Bearer token");

            expect(res.body).toEqual({
                status: 404,
                error: "Carousel Item not found",
                message: "The carousel item 'abcdefabcdefabcdefabcdef' doesn't exist",
                path: "/api/carousel/abcdefabcdefabcdefabcdef"
            });
        });
    });
});
