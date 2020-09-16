import { Router } from "express";

const router = Router();

router.get("/getAllUsers/", (_, res) => {
    res.json({
        username: "Test"
    });
});

export default router;