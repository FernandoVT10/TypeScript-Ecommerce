import app from "../../../app";
import supertest from "supertest";

import Promotion, { IPromotion } from "../../../models/Promotion";
import User from "../../../models/User";

import * as imageFunctions from "../";

const request = supertest(app);

mockAuthentication();
setupTestDB("test_promotions_updateOne_api");

const IMAGE_MOCK = Buffer.from("test image");

const PROMOTION_MOCK = {
    title: "test 1",
    link: "https://test-1.com",
    image: "test.webp"
}

const mockedUploadPromotionImage = jest.spyOn(imageFunctions, "uploadPromotionImage");
const mockedDeletePromotionImage = jest.spyOn(imageFunctions, "deletePromotionImage");

describe("/api/promotions/createOne", () => {
    let promotionId = "";

    beforeEach(async () => {
        mockedUploadPromotionImage.mockReset();
        mockedDeletePromotionImage.mockReset();

        mockedUploadPromotionImage.mockResolvedValue("updated.webp");

        const promotion = await Promotion.create(PROMOTION_MOCK);
        promotionId = promotion._id;

        await User.updateOne({}, { permits: "ADMIN" });
    });

    it("should update a promotion", async () => {
        const res = await request.put(`/api/promotions/${promotionId}`)
            .field("title", "updated title")
            .field("link", "updated link")
            .attach("newImage", IMAGE_MOCK, "updated.webp")
            .set("Authorization", "Bearer token");

        const updatedPromotion = res.body.data.updatedPromotion as IPromotion;

        const promotion = await Promotion.findById(updatedPromotion._id);

        expect(promotion.title).toBe("updated title");
        expect(promotion.link).toBe("updated link");
        expect(promotion.image).toBe("updated.webp");

        expect(mockedUploadPromotionImage).toHaveBeenCalled();
        expect(mockedDeletePromotionImage).toHaveBeenCalledTimes(1);
        expect(mockedDeletePromotionImage).toHaveBeenCalledWith("test.webp");
    });

    it("should update a promotion without an image", async () => {
        const res = await request.put(`/api/promotions/${promotionId}`)
            .field("title", "updated title")
            .field("link", "updated link")
            .set("Authorization", "Bearer token");

        const updatedPromotion = res.body.data.updatedPromotion as IPromotion;

        const promotion = await Promotion.findById(updatedPromotion._id);

        expect(promotion.title).toBe("updated title");
        expect(promotion.link).toBe("updated link");
        expect(promotion.image).toBe("test.webp");

        expect(mockedUploadPromotionImage).not.toHaveBeenCalled();
        expect(mockedDeletePromotionImage).not.toHaveBeenCalled();
    });

    it("should delete the newImage if there is an error when updatating the promotion", async () => {
        await request.put(`/api/promotions/${promotionId}`)
            .field("title", "")
            .attach("newImage", IMAGE_MOCK, "updated.webp")
            .set("Authorization", "Bearer token");

        expect(mockedUploadPromotionImage).toHaveBeenCalled();
        expect(mockedDeletePromotionImage).toHaveBeenCalledTimes(1);
        expect(mockedDeletePromotionImage).toHaveBeenCalledWith("updated.webp");
    });

    it("should delete the newImage if there is an error when updatating the promotion", async () => {
        const res = await request.put(`/api/promotions/abcdefabcdefabcdefabcdef`)
            .field("title", "updated title")
            .field("link", "updated link")
            .attach("newImage", IMAGE_MOCK, "updated.webp")
            .set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 404,
            error: "Promotion not found",
            message: "The promotion 'abcdefabcdefabcdefabcdef' doesn't exist",
            path: "/api/promotions/abcdefabcdefabcdefabcdef"
        });
    });
});
