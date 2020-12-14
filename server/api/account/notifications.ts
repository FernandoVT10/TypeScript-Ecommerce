import { Router } from "express";

import Notification from "../../models/Notification";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId });

	await Notification.update({ userId: req.userId, viewed: false }, { viewed: true })

	res.json({
	    data: { notifications }
	});
    } catch {
	res.json({
	    data: {
		notifications: []
	    }
	});
    }
});

router.delete("/:notificationId", async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findOne({
	    _id: notificationId,
	    userId: req.userId
	});

	if(!notification) {
	    return res.json({
	    	status: 404,
		error: "Not found",
		message: "The notification doesn't exists",
		path: req.originalUrl
	    });
	}

	const deletedNotification = await notification.delete();

	res.json({
	    data: { deletedNotification }
	});
    } catch (err) {
	return res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
});

export default router;
