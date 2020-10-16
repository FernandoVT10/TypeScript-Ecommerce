import app from "../../app";
import supertest from "supertest";
import Promotion, { IPromotion } from "../../models/Promotion";

const request = supertest(app);

setupTestDB("test_promotions_api");

const PROMOTIONS_MOCK = [
    {
        image: "test-1.jpg",
        title: "test title",
        link: "https://example.com"
    },
    {
        image: "test-2.jpg",
        title: "test title 2",
        link: "https://example.com"
    }
];

describe("Promotions API", () => {
    beforeEach(async () => {
        await Promotion.insertMany(PROMOTIONS_MOCK);
    });

    describe("GET", () => {
        it("should get all promotions", async () => {
            const res = await request.get("/api/promotions");

            const promotions: IPromotion[] = res.body.data.promotions;

            expect(promotions[0].title).toBe("test title");
            expect(promotions[0].image).toBe("test-1.jpg");

            expect(promotions[1].title).toBe("test title 2");
            expect(promotions[1].image).toBe("test-2.jpg");
        });
    });
});