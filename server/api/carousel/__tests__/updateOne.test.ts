import app from "../../../app";
import supertest from "supertest";

import * as imageFunctions from "../";

import User from "../../../models/User";
import Carousel, { ICarousel } from "../../../models/Carousel";

const request = supertest(app);

mockAuthentication();
setupTestDB("test_carousel_updateOne_api");

const CAROUSEL_ITEM_MOCK = {
    link: "test link",
    image: "test.webp"
}

const IMAGE_MOCK = Buffer.from("test image");

const mockedUploadCarouselImage = jest.spyOn(imageFunctions, "uploadCarouselImage");
const mockedDeleteCarouselImage = jest.spyOn(imageFunctions, "deleteCarouselImage");

describe("/api/carousel/updateOne", () => {
    let carouselItemId = "";

    beforeEach(async () => {
        await User.updateOne({}, { permits: "ADMIN" });

        const carouselItem = await Carousel.create(CAROUSEL_ITEM_MOCK);
        carouselItemId = carouselItem._id;

        mockedUploadCarouselImage.mockReset();
        mockedDeleteCarouselImage.mockReset();

        mockedUploadCarouselImage.mockResolvedValue("updated.webp");
    });

    it("should update a carousel item", async () => {
        const res = await request.put(`/api/carousel/${carouselItemId}`)
            .field("link", "updated link")
            .attach("newImage", IMAGE_MOCK, "updated.webp")
            .set("Authorization", "Bearer token");

        const updatedCarouselItem = res.body.data.updatedCarouselItem as ICarousel;

        const carouselItem = await Carousel.findById(updatedCarouselItem._id);

        expect(carouselItem.link).toBe("updated link");
        expect(carouselItem.image).toBe("updated.webp");
        
        expect(mockedDeleteCarouselImage).toHaveBeenCalledWith("test.webp");
        expect(mockedUploadCarouselImage).toHaveBeenCalled();
    });

    it("should update a carousel item without the newImage parameter", async () => {
        const res = await request.put(`/api/carousel/${carouselItemId}`)
            .field("link", "updated link")
            .set("Authorization", "Bearer token");

        const updatedCarouselItem = res.body.data.updatedCarouselItem as ICarousel;

        const carouselItem = await Carousel.findById(updatedCarouselItem._id);

        expect(carouselItem.link).toBe("updated link");
        expect(carouselItem.image).toBe("test.webp");
        
        expect(mockedDeleteCarouselImage).not.toHaveBeenCalled();
        expect(mockedUploadCarouselImage).not.toHaveBeenCalled();
    });

    it("shouldn't delete the oldImage and it should delete the newImage when an error appears", async () => {
        const res = await request.put(`/api/carousel/${carouselItemId}`)
            .attach("newImage", IMAGE_MOCK, "updated.webp")
            .set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 400,
            error: "Validation Error",
            message: expect.any(String),
            path: `/api/carousel/${carouselItemId}`
        });
        
        expect(mockedUploadCarouselImage).toHaveBeenCalled();

        expect(mockedDeleteCarouselImage).not.toHaveBeenCalledWith("test.webp");
        expect(mockedDeleteCarouselImage).toHaveBeenCalledWith("updated.webp");
    });

    it("should return an error when the carouselItem doesn't exist", async () => {
        const res = await request.put("/api/carousel/abcdefabcdefabcdefabcdef")
            .field("link", "updated link")
            .attach("newImage", IMAGE_MOCK, "updated.webp")
            .set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 404,
            error: "Carousel Item not found",
            message: "The carousel item 'abcdefabcdefabcdefabcdef' doesn't exist",
            path: "/api/carousel/abcdefabcdefabcdefabcdef"
        });
    });
});
