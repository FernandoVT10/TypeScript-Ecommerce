import { Router } from "express";

import Order from "../../models/Order";

const router = Router();

router.get("/", async (req, res) => {
    try {
	const orders = await Order.find({
	    userId: req.userId,
	    status: "COMPLETED"
	})
	.populate("products.originalProduct", "title images")
	.sort({ createdAt: "desc" });

        res.json({
            data: { orders }
        });
    } catch {
        res.json({
            data: {
		orders: []
	    }
        });
    }
});

export default router;
