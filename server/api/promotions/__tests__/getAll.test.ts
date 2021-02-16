import app from "../../../app";
import supertest from "supertest";

import Promotion, { IPromotion } from "../../../models/Promotion";

const request = supertest(app);
setupTestDB("test_promotions_getAll_api");

const PROMOTIONS_MOCK = [
    { title: "test 1 ", link: "https://test-1.com", image: "test-1.webp" },
    { title: "test 2 ", link: "https://test-2.com", image: "test-2.webp" },
    { title: "test 3 ", link: "https://test-3.com", image: "test-3.webp" }
];

describe("/api/promotions/getAll", () => {
    beforeEach(async () => {
        await Promotion.insertMany(PROMOTIONS_MOCK);
    });

    it("should get all the promotions", async () => {
        const res = await request.get("/api/promotions");

        const promotions = res.body.data.promotions as IPromotion[];

        PROMOTIONS_MOCK.forEach((promotion, index) => {
            expect(promotion.title).toBe(promotions[index].title);
            expect(promotion.link).toBe(promotions[index].link);
            expect(promotion.image).toBe(promotions[index].image);
        });
    });
});
