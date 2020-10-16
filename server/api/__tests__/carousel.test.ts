import app from "../../app";
import supertest from "supertest";
import Carousel, { ICarousel } from "../../models/Carousel";

const request = supertest(app);

setupTestDB("test_carousel_api");

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

describe("Carousel API", () => {
    beforeEach(async () => {
        await Carousel.insertMany(CAROUSEL_MOCKS);
    });

    describe("GET", () => {
        it("should get all carousel items", async () => {
            const res = await request.get("/api/carousel");

            const carouselItems: ICarousel[] = res.body.data.carousel;

            expect(carouselItems[0].image).toBe("test-1.jpg");
            expect(carouselItems[1].image).toBe("test-2.jpg");
        });
    });
});