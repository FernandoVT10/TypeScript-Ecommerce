import { Error } from "mongoose";
import { Request, Response } from "express";

import Carousel from "../../models/Carousel";

import { uploadCarouselImage, deleteCarouselImage } from "./";

export default async (req: Request, res: Response) => {
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
    
    let imageName = "";

    try {
        imageName = await uploadCarouselImage(image);

        const createdCarouselItem = await Carousel.create({
            link,
            image: imageName
        });

        res.json({
            data: { createdCarouselItem }
        });
    } catch(err) {
        deleteCarouselImage(imageName);

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
