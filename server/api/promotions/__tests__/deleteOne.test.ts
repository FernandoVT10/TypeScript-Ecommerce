import app from "../../../app";
import supertest from "supertest";

import Promotion, { IPromotion } from "../../../models/Promotion";
import User from "../../../models/User";

import * as imageFunctions from "../";

const request = supertest(app);

mockAuthentication();
setupTestDB("test_promotions_deleteOne_api");

const PROMOTION_MOCK = {
    title: "test 1",
    link: "https://test-1.com",
    image: "test.webp"
}

const mockedDeletePromotionImage = jest.spyOn(imageFunctions, "deletePromotionImage");

describe("/api/promotions/deleteOne", () => {
    let promotionId = "";

    beforeEach(async () => {
        mockedDeletePromotionImage.mockReset();

        const promotion = await Promotion.create(PROMOTION_MOCK);
        promotionId = promotion._id;

        await User.updateOne({}, { permits: "ADMIN" });
    });

    it("should delete a pormotion", async () => {
        const res = await request.delete(`/api/promotions/${promotionId}`).set("Authorization", "Bearer token");

        const deletedPromotion = res.body.data.deletedPromotion as IPromotion;

        expect(await Promotion.exists({ _id: deletedPromotion._id })).toBeFalsy();

        expect(deletedPromotion.title).toBe("test 1");
        expect(deletedPromotion.link).toBe("https://test-1.com");
        expect(deletedPromotion.image).toBe("test.webp");
    });

    it("should return an error when the promotion doesn't exist", async () => {
        const res = await request.delete("/api/promotions/abcdefabcdefabcdefabcdef").set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 404,
            error: "Promotion not found",
            message: "The promotion 'abcdefabcdefabcdefabcdef' doesn't exist",
            path: "/api/promotions/abcdefabcdefabcdefabcdef"
        });
    });
});
