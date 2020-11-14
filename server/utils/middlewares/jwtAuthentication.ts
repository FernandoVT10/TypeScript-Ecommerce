import express from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../config";

import User, { IUser } from "../../models/User";

export default async function jwtAuthentication(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { token } = req.cookies;

    if(!token) {
	next();
	return;
    }

    try {
	const decodedData = jwt.verify(token, JWT_SECRET_KEY);

	req.userId = decodedData.userId;

	next();
    } catch {
	next();
    }
}
