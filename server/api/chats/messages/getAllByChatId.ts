import { Request, Response } from "express";

import Message from "../../../models/Message";

export default async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const { chatId } = req.query;

    try {
        const messages = await Message.find({ chatId }).sort({ createdAt: "desc" }).limit(limit).skip(limit * (page - 1));

        res.json({
            data: {
                messages
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
