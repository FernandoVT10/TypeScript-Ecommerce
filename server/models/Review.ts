import mongoose, { Schema, Document } from "mongoose";

import { IProduct } from "./Product";
import { IUser } from "./User";

export interface IReview extends Document {
    userId: IUser["_id"],
    productId: IProduct["_id"],
    content: string,
    calification: string
}

const reviewSchema = new Schema({
    userId: {
	type: Schema.Types.ObjectId,
	ref: "users"
    },
    productId: {
	type: Schema.Types.ObjectId,
	ref: "reviews"
    },
    content: {
        type: String,
	maxlength: 500,
        required: true
    },
    calification: {
        type: Number,
	min: 1,
	max: 5,
        required: true
    }
}, { timestamps: true });

export default mongoose.model<IReview>("reviews", reviewSchema);
