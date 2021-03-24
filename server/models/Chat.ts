import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "./User";

export interface IChat extends Document {
    userId: IUser["_id"]
}

const chatSchema = new Schema({
    userId: {
	type: Schema.Types.ObjectId,
	ref: "users"
    }
}, { timestamps: true });

export default mongoose.model<IChat>("chats", chatSchema);
