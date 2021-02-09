import { Request, Response } from "express";

import Promotion from "../../models/Promotion";

import { uploadPromotionImage, deletePromotionImage } from "./";

export default async (req: Request, res: Response) => {
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
        imageName = await uploadPromotionImage(image);

        const createdPromotion = await Promotion.create({
            ...req.body,
            image: imageName
        });

        res.json({
            data: { createdPromotion }
        });
    } catch (err) {
        deletePromotionImage(imageName);

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
