import mongoose, { Schema, Document } from "mongoose";

import { IProduct } from "./Product";
import { IUser } from "./User";

export interface IOrder extends Document {
    userId: IUser["_id"],
    paypalOrderId: string,
    products: {
	originalProduct: IProduct["_id"],
	price: number,
	discount?: number,
	quantity: number
    }[],
    total: number,
    status?: "PENDING" | "COMPLETED"
}

const orderSchema = new Schema({
    userId: {
	type: Schema.Types.ObjectId,
	ref: "users"
    },
    paypalOrderId: {
	type: String,
	required: true
    },
    products: [{
	_id: false,
	originalProduct: {
	    type: Schema.Types.ObjectId,
	    ref: "products"
	},
	price: {
	    type: Number,
	    required: true
	},
	discount: {
	    type: Number,
	    min: 0,
	    max: 100,
	    default: 0
	},
	quantity: {
	    type: Number,
	    required: true
	}
    }],
    total: {
	type: Number,
	required: true
    },
    status: {
	type: String,
	enum: ["PENDING", "COMPLETED"],
	default: "PENDING"
    }
}, { timestamps: true });

export default mongoose.model<IOrder>("orders", orderSchema);
