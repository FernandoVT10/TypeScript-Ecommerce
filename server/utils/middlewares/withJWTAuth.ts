import express from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../config";

import User from "../../models/User";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { token } = req.cookies;

    if(!token) {
	res.json({
	    status: 401,
	    error: "No authorization cookie",
	    message: "The authorization cookie doesn't exists",
	    path: req.originalUrl
	});

	return;
    }

    try {
	const decodedData = jwt.verify(token, JWT_SECRET_KEY) as { userId: string };

	const { userId } = decodedData;

	const userExists = await User.exists({ _id: userId });

	if(!userExists) {
	    next();
	    return;
	}

	req.userId = userId;

	next();
    } catch(err) {
	if (err instanceof jwt.JsonWebTokenError) {
	    res.json({
		status: 401,
		error: "Invalid Token",
		message: err.message,
		path: req.originalUrl
	    });

	    return;
	}

	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
}
