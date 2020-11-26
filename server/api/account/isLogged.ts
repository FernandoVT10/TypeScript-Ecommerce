import { Request, Response } from "express";

import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../config";

import User from "../../models/User";

export default async (req: Request, res: Response) => {
    const bearer = req.headers["authorization"];
    const token = bearer.replace("token", "");

    try {
	const decodedData = jwt.verify(token, JWT_SECRET_KEY) as { userId: string };

	const { userId } = decodedData;

	const userExists = await User.exists({ _id: userId });

	if(userExists) {
	    return res.json({
		data: {
		    isLogged: true
		}
	    });
	}
    } catch {}

    res.json({
	data: {
	    isLogged: false
	}
    });
}
