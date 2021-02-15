import { Request, Response } from "express";

import Carousel from "../../models/Carousel";

export default async (_req: Request, res: Response) => {
    try {
        const carouselItems = await Carousel.find();

        res.json({
            data: { carouselItems }
        });
    } catch {
        res.json({
            data: { carouselItems: [] }
        });
    }
}
