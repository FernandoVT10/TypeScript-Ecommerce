import multer from "multer";
import { Router } from "express";

import { CAROUSEL_IMAGE_SIZES } from "../../utils/imagesSizes";

import withJWTAuth from "../../utils/middlewares/withJWTAuth";
import withAdmin from "../../utils/middlewares/withAdmin";

import { uploadImage, deleteImage, fileFilter } from "../../utils/services/ImageController";

import getAll from "./getAll";
import createOne from "./createOne";
import updateOne from "./updateOne";
import deleteOne from "./deleteOne";

const LABELS = CAROUSEL_IMAGE_SIZES.map(size => size.label);

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter });

export const uploadCarouselImage = (image: Express.Multer.File) => uploadImage(
    image, CAROUSEL_IMAGE_SIZES, "/carousel/"
);

export const deleteCarouselImage = (imageName: string) => deleteImage(imageName, LABELS, "/carousel/");

const router = Router();

router.get("/", getAll);
router.post("/", withJWTAuth, withAdmin, upload.single("image"), createOne);
router.put("/:carouselItemId", withJWTAuth, withAdmin, upload.single("newImage"), updateOne);
router.delete("/:carouselItemId", withJWTAuth, withAdmin, deleteOne);

export default router;
