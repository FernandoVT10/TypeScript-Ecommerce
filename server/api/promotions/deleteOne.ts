import { Request, Response } from "express";

import Promotion from "../../models/Promotion";

import { deletePromotionImage } from "./";

export default async (req: Request, res: Response) => {
    const { promotionId } = req.params;

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

        const deletedPromotion = await promotion.delete();
        
        deletePromotionImage(promotion.image);

        res.json({
            data: { deletedPromotion }
        });
    } catch (err) {
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
