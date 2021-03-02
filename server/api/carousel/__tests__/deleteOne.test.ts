import app from "../../../app";
import supertest from "supertest";

import * as imageFunctions from "../";

import User from "../../../models/User";
import Carousel, { ICarousel } from "../../../models/Carousel";

const request = supertest(app);

mockAuthentication();
setupTestDB("test_carousel_deleteOne_api");

const CAROUSEL_ITEM_MOCK = {
    image: "test.webp",
    link: "test link"
}

const mockedDeleteCarouselImage = jest.spyOn(imageFunctions, "deleteCarouselImage");

describe("/api/carousel/createOne", () => {
    let carouselItemId = "";

    beforeEach(async () => {
        await User.updateOne({}, { permits: "ADMIN" });
        const carouselItem = await Carousel.create(CAROUSEL_ITEM_MOCK);
        carouselItemId = carouselItem._id;

        mockedDeleteCarouselImage.mockReset();
    });

    it("should delete a carousel item", async () => {
        const res = await request.delete(`/api/carousel/${carouselItemId}`).set("Authorization", "Bearer token");

        const deletedCarouselItem = res.body.data.deletedCarouselItem as ICarousel;

        expect(deletedCarouselItem.link).toBe("test link");
        expect(deletedCarouselItem.image).toBe("test.webp");

        expect(await Carousel.exists({ _id: deletedCarouselItem._id })).toBeFalsy();
    });

    it("should return an error when the carouselItem doesn't exist", async () => {
        const res = await request.delete(`/api/carousel/abcdefabcdefabcdefabcdef`).set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 404,
            error: "Carousel Item not found",
            message: `The carousel item 'abcdefabcdefabcdefabcdef' doesn't exist`,
            path: "/api/carousel/abcdefabcdefabcdefabcdef"
        });
    });
});
