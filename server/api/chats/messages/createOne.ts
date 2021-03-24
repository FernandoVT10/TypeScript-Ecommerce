import { Request, Response } from "express";

import Message from "../../../models/Message";
import Chat from "../../../models/Chat";

export default async (req: Request, res: Response) => {
    const { chatId } = res.locals;
    const { content } = req.body;

    try {
        const createdMessage = await Message.create({
            from: "user", chatId, content
        });

        await Chat.updateOne({ _id: chatId }, { $currentDate: { updatedAt: true } });
        
        res.json({
            data: {
                createdMessage
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
