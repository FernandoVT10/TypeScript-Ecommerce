import { Request, Response } from "express";

import Chat from "../../models/Chat";

const CHATS_PER_PAGE = 10;

export default async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || CHATS_PER_PAGE;
    const page = parseInt(req.query.page as string) || 1;

    try {
        const chats = await Chat.find().sort({ updatedAt: "desc" }).limit(limit).skip(limit * (page - 1));

        res.json({
            data: {
                chats
            }
        });
    } catch (err) {
        res.json({
            status: 500,
            error: "Internal Server Error",
            message: err.message,
            path: req.originalUrl
        });
    }
}
