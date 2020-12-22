import { Router } from "express";

import Order from "../../models/Order";

import shipping from "./shipping";

const router = Router();

const PAGINATE_CUSTOM_LABELS = {
    totalDocs: "totalOrders",
    docs: "orders"
}

const ORDERS_PER_PAGE = 3;

router.use("/:orderId/shipping/", shipping);

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit as string) || ORDERS_PER_PAGE;
    const page = parseInt(req.query.page as string) || 1;

    try {
        const orders = await Order.paginate({ status: { $ne: "PENDING" } }, {
            page,
	    limit,
	    sort: { updatedAt: "desc" },
	    populate: [
		{
		    path: "user",
		    select: "username"
		},
		{
		    path: "products.originalProduct",
		    select: "title images"
		},
		"shipping"
	    ],
	    customLabels: PAGINATE_CUSTOM_LABELS
        });

	res.json({ data: orders });
    } catch (err) {
	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
});

export default router;
