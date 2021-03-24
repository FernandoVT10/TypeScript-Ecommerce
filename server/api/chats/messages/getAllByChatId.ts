import { Request, Response } from "express";

import Message from "../../../models/Message";

export default async (req: Request, res: Response) => {
    const { chatId } = req.query;

    try {
        const messages = await Message.find({ chatId });

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
