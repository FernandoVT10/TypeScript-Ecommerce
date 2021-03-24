import { Request, Response, NextFunction } from "express";

import Chat from "../../models/Chat";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        let chatId = "";

        const chat = await Chat.findOne({ userId: req.userId });

        if(!chat) {
            const newChat = await Chat.create({ userId: req.userId });
            chatId = newChat._id;
        } else {
            chatId = chat._id;
        }

        res.locals.chatId = chatId;
        next();
    } catch (err) {
        res.json({
            status: 500,
            error: "Internal Server Error",
            message: err.message,
            path: req.originalUrl
        });
    }
}
