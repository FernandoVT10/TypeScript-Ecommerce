import { Error } from "mongoose";
import { Request, Response } from "express";

import Carousel from "../../models/Carousel";

import { deleteCarouselImage } from "./";

export default async (req: Request, res: Response) => {
    const { carouselItemId } = req.params;

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

        const deletedCarouselItem = await carouselItem.delete();

        deleteCarouselImage(carouselItem.image);

        res.json({
            data: { deletedCarouselItem }
        });
    } catch(err) {
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
