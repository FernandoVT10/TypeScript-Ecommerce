import { Request, Response } from "express";

import Promotion from "../../models/Promotion";

import { deletePromotionImage, uploadPromotionImage } from "./";

export default async (req: Request, res: Response) => {
    const { promotionId } = req.params;

    const newImage = req.file;

    let newImageName = "";

    try {
        const promotion = await Promotion.findById(promotionId);

        if(!promotion) {
            return res.json({
                status: 404,
                error: "Promotion not found",
                message: `The promotion '${promotionId}' doesn't exist`,
                path: req.originalUrl
            });
        }

        const oldImageName = promotion.image;

        Object.assign(promotion, req.body);
        
        if(newImage) {
            newImageName = await uploadPromotionImage(newImage);

            promotion.image = newImageName;
        }

        const updatedPromotion = await promotion.save();

        // if there is no error we will delete the old image
        if(newImage) deletePromotionImage(oldImageName);

        res.json({
            data: { updatedPromotion }
        });
    } catch (err) {
        if(newImageName.length) deletePromotionImage(newImageName);

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
