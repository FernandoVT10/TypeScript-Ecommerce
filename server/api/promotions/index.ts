import multer from "multer";
import { Router } from "express";

import withJWTAuth from "../../utils/middlewares/withJWTAuth";
import withAdmin from "../../utils/middlewares/withAdmin";

import { uploadImage, deleteImage, fileFilter } from "../../utils/services/ImageController";
import { PROMOTION_IMAGE_SIZES } from "../../utils/imagesSizes";

import getAll from "./getAll";
import createOne from "./createOne";
import updateOne from "./updateOne";
import deleteOne from "./deleteOne";

const LABELS = PROMOTION_IMAGE_SIZES.map(promotion => promotion.label);

export const deletePromotionImage = (imageName: string) => deleteImage(
    imageName, LABELS, "/promotions/"
);

export const uploadPromotionImage = (image: Express.Multer.File) => uploadImage(
    image, PROMOTION_IMAGE_SIZES, "/promotions/"
);

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter });

router.get("/", getAll);
router.post("/", withJWTAuth, withAdmin, upload.single("image"), createOne);
router.put("/:promotionId", withJWTAuth, withAdmin, upload.single("newImage"), updateOne);
router.delete("/:promotionId", withJWTAuth, withAdmin, deleteOne);

export default router;
