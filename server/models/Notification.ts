import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "./User";

export interface INotification extends Document {
    userId: IUser["_id"],
    from: string,
    message: string,
    viewed?: boolean,
    createdAt?: string,
    updatedAt?: string
}

const notificationSchema = new Schema({
    userId: {
	type: Schema.Types.ObjectId,
	ref: "users"
    },
    from: {
        type: String,
	maxlength: 30,
        required: true
    },
    message: {
        type: String,
	maxlength: 500,
        required: true
    },
    viewed: {
        type: Boolean,
	default: false
    }
}, { timestamps: true });

export default mongoose.model<INotification>("notifications", notificationSchema);
