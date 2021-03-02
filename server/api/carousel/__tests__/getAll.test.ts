import app from "../../../app";
import supertest from "supertest";

import Carousel, { ICarousel } from "../../../models/Carousel";

const request = supertest(app);

setupTestDB("test_carousel_getAll_api");

const CAROUSEL_ITEMS_MOCK = [
    {
        image: "test-1.jpg",
        link: "https://example.com"
    },
    {
        image: "test-2.jpg",
        link: "https://example.com"
    }
];

describe("/api/carousel/getAll", () => {
    beforeEach(async () => await Carousel.insertMany(CAROUSEL_ITEMS_MOCK));

    it("should get all carousel items", async () => {
        const res = await request.get("/api/carousel/");

        const carouselItems = res.body.data.carouselItems as ICarousel[];

        expect(carouselItems[0].image).toBe("test-1.jpg");
        expect(carouselItems[1].image).toBe("test-2.jpg");
    });
});
