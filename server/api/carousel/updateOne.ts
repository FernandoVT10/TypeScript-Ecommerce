import { Error } from "mongoose";
import { Request, Response } from "express";

import Carousel from "../../models/Carousel";

import { uploadCarouselImage, deleteCarouselImage } from "./";

export default async (req: Request, res: Response) => {
    const { carouselItemId } = req.params;

    const { link } = req.body;

    const newImage = req.file;

    let imageName = "";

    try {
        const carouselItem = await Carousel.findById(carouselItemId);
        
        if(!carouselItem) {
            return res.json({
                status: 404,
                error: "Carousel Item not found",
                message: `The carousel item '${carouselItemId}' doesn't exist`,
                path: req.originalUrl
            });
        }

        let oldImage = carouselItem.image;

        if(newImage) {
            imageName = await uploadCarouselImage(newImage);
            carouselItem.image = imageName;
        }

        carouselItem.link = link;

        const updatedCarouselItem = await carouselItem.save();

        if(newImage) deleteCarouselImage(oldImage);

        res.json({
            data: { updatedCarouselItem }
        });
    } catch(err) {
        if(imageName.length) deleteCarouselImage(imageName);

        if(err instanceof Error) {
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
}
