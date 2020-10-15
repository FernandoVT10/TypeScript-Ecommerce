import { Router } from "express";

import Carousel from "../models/Carousel";

const router = Router();

router.get("/", async (_req, res) => {
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

export default router;