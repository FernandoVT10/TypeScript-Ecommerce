import mongoose, { Schema, Document } from "mongoose";

import { IChat } from "./Chat";

export interface IMessage extends Document {
    chatId: IChat["_id"],
    from: "user" | "admin",
    content: string
}

const messageSchema = new Schema({
    chatId: {
	type: Schema.Types.ObjectId,
	ref: "chat",
        required: true
    },
    from: {
	type: String,
	enum: ["user", "admin"],
        required: true
    },
    content: {
        type: String,
        maxLength: 500,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<IMessage>("messages", messageSchema);
