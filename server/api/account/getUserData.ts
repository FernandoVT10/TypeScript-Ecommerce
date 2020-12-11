import mongoose from "mongoose";
import { Request, Response } from "express";

import User from "../../models/User";

export default async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);

	res.json({
	    data: {
		user: {
		    username: user.username,
		    name: user.name,
		    email: user.email
		}
	    }
	});
    } catch (err) {
	if(err instanceof mongoose.Error) {
	    return res.json({
		status: 400,
		error: "Bad Request",
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
