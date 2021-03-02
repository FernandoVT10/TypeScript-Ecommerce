import { mocked } from "ts-jest/utils";

import app from "../../../app";
import supertest from "supertest";

import * as imageFunctions from "../";

import User from "../../../models/User";
import Carousel, { ICarousel } from "../../../models/Carousel";

const request = supertest(app);

mockAuthentication();
setupTestDB("test_carousel_createOne_api");

const IMAGE_MOCK = Buffer.from("test image");

const mockedUploadCarouselImage = jest.spyOn(imageFunctions, "uploadCarouselImage");
const mockedDeleteCarouselImage = jest.spyOn(imageFunctions, "deleteCarouselImage");

describe("/api/carousel/createOne", () => {
    beforeEach(async () => {
        await User.updateOne({}, { permits: "ADMIN" });

        mockedUploadCarouselImage.mockReset();
        mockedDeleteCarouselImage.mockReset();

        mockedUploadCarouselImage.mockResolvedValue("created.webp");
    });

    it("should create a carousel item", async () => {
        const res = await request.post("/api/carousel")
            .field("link", "test link")
            .attach("image", IMAGE_MOCK, "test.jpg")
            .set("Authorization", "Bearer token");

        const createdCarouselItem = res.body.data.createdCarouselItem as ICarousel;

        const carouselItem = await Carousel.findById(createdCarouselItem._id);

        expect(carouselItem.link).toBe("test link");
        expect(carouselItem.image).toBe("created.webp");

        expect(mockedUploadCarouselImage).toHaveBeenCalled();
    });

    it("should delete the image when an error appears", async () => {
        const res = await request.post("/api/carousel")
            .attach("image", IMAGE_MOCK, "test.jpg")
            .set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 400,
            error: "Validation Error",
            message: expect.any(String),
            path: "/api/carousel"
        });

        expect(mockedUploadCarouselImage).toHaveBeenCalled();
        expect(mockedDeleteCarouselImage).toHaveBeenCalledWith("created.webp");
    });

    it("should return an error when the image is not defined", async () => {
        const res = await request.post("/api/carousel")
            .field("link", "test link")
            .set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 400,
            error: "Bad Request",
            message: "The image is required",
            path: "/api/carousel"
        });
    });
});
