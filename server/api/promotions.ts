import { Router } from "express";

import Promotion from "../models/Promotion";

const router = Router();

router.get("/", async (_, res) => {
    try {
        const promotions = await Promotion.find();

        res.json({ data: { promotions } });
    } catch {
        res.json({
            data: { promotions: [] }
        });
    }
});

export default router;