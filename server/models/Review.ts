import mongoose, { Schema, Document } from "mongoose";

import { IProduct } from "./Product";

export interface IReview extends Document {
    productId: IProduct["_id"],
    content: string,
    calification: string
}

const reviewSchema = new Schema({
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
