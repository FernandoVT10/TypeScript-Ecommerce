import multer from "multer";
import mongoose from "mongoose";

import { Router } from "express";

import Carousel from "../models/Carousel";

import withJWTAuth from "../utils/middlewares/withJWTAuth";
import withAdmin from "../utils/middlewares/withAdmin";

import { uploadImage, deleteImage, fileFilter } from "../utils/services/ImageController";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter });

const IMAGE_SIZES = [
    {
        label: "large",
        width: 1920,
        height: 1080
    },
    {
        label: "medium",
        width: 1024,
        height: 575
    },
    {
        label: "small",
        width: 500,
        height: 280
    }
];

const LABELS = IMAGE_SIZES.map(size => size.label);

router.get("/getAllItems/", async (_req, res) => {
    try {
        const carouselDocuments = await Carousel.find();

        res.json({
            data: { carousel: carouselDocuments }
        });
    } catch {
        res.json({
            data: { carousel: [] }
        });
    }
});

router.post("/", withJWTAuth, withAdmin, upload.single("image"), async (req, res) => {
    const { link } = req.body;
    const image = req.file;
    
    if(!image) {
        return res.json({
            status: 400,
            error: "Bad Request",
            message: "The image is required",
            path: req.originalUrl
        });
    }

    try {
        const imageName = await uploadImage(image, IMAGE_SIZES, "/carousel/");

        const createdCarouselItem = await Carousel.create({
            link,
            image: imageName
        });

        res.json({
            data: { createdCarouselItem }
        });
    } catch(err) {
        if(err instanceof mongoose.Error) {
            return res.json({
                status: 400,
                error: "Validation Error",
                message: err.message,
                path: req.originalUrl
            });   
        }

        res.json({
            status: 500,
            error: "Internal Server Error",
            message: err.message,
            path: req.originalUrl
        });
    }
});

router.put("/:carouselItemId", withJWTAuth, withAdmin, upload.single("newImage"), async (req, res) => {
    const { carouselItemId } = req.params;
    const { link } = req.body;
    const newImage = req.file;

    try {
        const carouselItem = await Carousel.findById(carouselItemId);
        
        if(!carouselItem) {
            return res.json({
                status: 404,
                error: "Carousel Item not found",
                message: `The carousel item ${carouselItemId} doesn't exist`,
                path: req.originalUrl
            });
        }

        if(newImage) {
            deleteImage(carouselItem.image, LABELS, "/carousel/");

            const imageName = await uploadImage(newImage, IMAGE_SIZES, "/carousel/");
            
            carouselItem.image = imageName;
        }

        carouselItem.link = link;

        const updatedCarouselItem = await carouselItem.save();

        res.json({
            data: { updatedCarouselItem }
        });
    } catch(err) {
        if(err instanceof mongoose.Error) {
            return res.json({
                status: 400,
                error: "Validation Error",
                message: err.message,
                path: req.originalUrl
            });   
        }

        res.json({
            status: 500,
            error: "Internal Server Error",
            message: err.message,
            path: req.originalUrl
        });
    }
});

router.delete("/:carouselItemId", withJWTAuth, withAdmin, async (req, res) => {
    const { carouselItemId } = req.params;

    try {
        const carouselItem = await Carousel.findById(carouselItemId);
        
        if(!carouselItem) {
            return res.json({
                status: 404,
                error: "Carousel Item not found",
                message: `The carousel item ${carouselItemId} doesn't exist`,
                path: req.originalUrl
            });
        }

        deleteImage(carouselItem.image, LABELS, "/carousel/");

        const deletedCarouselItem = await carouselItem.delete();

        res.json({
            data: { deletedCarouselItem }
        });
    } catch(err) {
        if(err instanceof mongoose.Error) {
            return res.json({
                status: 400,
                error: "Validation Error",
                message: err.message,
                path: req.originalUrl
            });   
        }

        res.json({
            status: 500,
            error: "Internal Server Error",
            message: err.message,
            path: req.originalUrl
        });
    }
});

export default router;
