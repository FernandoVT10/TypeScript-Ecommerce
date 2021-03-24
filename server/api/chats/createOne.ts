import { Request, Response } from "express";

import Chat from "../../models/Chat";
import User from "../../models/User";

export default async (req: Request, res: Response) => {
    const userId = req.body.userId;

    try {
        if(await User.find({ _id: userId })) {
            return res.json({
                status: 404,
                error: "Not found",
                message: `The user with the id '${userId}' doesn't exist`,
                path: req.originalUrl
            });
        }

        if(await Chat.exists({ userId })) {
            return res.json({
                status: 400,
                error: "Bad Request",
                message: "The chat already exists",
                path: req.originalUrl
            });
        }

        await Chat.create({ userId });

        res.json({
            data: {
                message: "The chat has been created successfully"
            }
        });
    } catch (err) {
        if(err instanceof Error) {
            res.json({
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
