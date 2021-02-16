import app from "../../../app";
import supertest from "supertest";

import Promotion, { IPromotion } from "../../../models/Promotion";
import User from "../../../models/User";

import * as imageFunctions from "../";

const request = supertest(app);

mockAuthentication();
setupTestDB("test_promotions_createOne_api");

const PROMOTION_MOCK = {
    title: "test 1",
    link: "https://test-1.com",
    image: Buffer.from("test image")
}

const mockedUploadPromotionImage = jest.spyOn(imageFunctions, "uploadPromotionImage");
const mockedDeletePromotionImage = jest.spyOn(imageFunctions, "deletePromotionImage");

describe("/api/promotions/createOne", () => {
    beforeEach(async () => {
        mockedUploadPromotionImage.mockReset();
        mockedDeletePromotionImage.mockReset();

        mockedUploadPromotionImage.mockResolvedValue("test.webp");

        await User.updateOne({}, { permits: "ADMIN" });
    });

    it("should create a pormotion", async () => {
        const res = await request.post("/api/promotions/")
            .field("title", PROMOTION_MOCK.title)
            .field("link", PROMOTION_MOCK.link)
            .attach("image", PROMOTION_MOCK.image, "test.webp")
            .set("Authorization", "Bearer token");

        const createdPromotion = res.body.data.createdPromotion as IPromotion;

        const promotion = await Promotion.findById(createdPromotion._id);

        expect(promotion.title).toBe("test 1");
        expect(promotion.link).toBe("https://test-1.com");
        expect(promotion.image).toBe("test.webp");

        expect(mockedUploadPromotionImage).toHaveBeenCalled();
    });

    it("should return an error when the image doesn't exist", async () => {
        const res = await request.post("/api/promotions/")
            .field("title", PROMOTION_MOCK.title)
            .field("link", PROMOTION_MOCK.link)
            .set("Authorization", "Bearer token");

        expect(res.body).toEqual({
            status: 400,
            error: "Bad Request",
            message: "The image is required",
            path: "/api/promotions/"
        });
    });

    it("should delete the image when there is an error when creating the promotion", async () => {
        await request.post("/api/promotions/")
            .field("link", PROMOTION_MOCK.link)
            .attach("image", PROMOTION_MOCK.image, "test.webp")
            .set("Authorization", "Bearer token");

        expect(mockedUploadPromotionImage).toHaveBeenCalled();
        expect(mockedDeletePromotionImage).toHaveBeenCalledWith("test.webp");
    });
});
