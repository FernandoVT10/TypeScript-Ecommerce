import { Request, Response } from "express";

import Promotion from "../../models/Promotion";

export default async (_: Request, res: Response) => {
    try {
        const promotions = await Promotion.find();

        res.json({ data: { promotions } });
    } catch {
        res.json({
            data: { promotions: [] }
        });
    }
}
