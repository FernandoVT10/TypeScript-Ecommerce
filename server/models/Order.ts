import mongoose, { Schema, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { IProduct } from "./Product";
import { IShipping } from "./Shipping";
import { IUser } from "./User";

export interface IOrder extends Document {
    userId: IUser["_id"],
    shipping?: IShipping["_id"],
    paypalOrderId: string,
    address: {
	fullName: string,
	postalCode: string,
	state: string,
	municipality: string,
	suburb: string,
	street: string,
	outdoorNumber: string,
	interiorNumber?: string,
	phoneNumber: string,
	additionalInformation?: string
    },
    products: {
	originalProduct: IProduct["_id"],
	price: number,
	discount?: number,
	quantity: number
    }[],
    total: number,
    status?: "PENDING" | "SHIPPING" | "COMPLETED"
}

interface IOrderModel extends Model<IOrder> {
    paginate(query?: object, options?: object): Promise<Array<IOrder>>
}

const orderSchema = new Schema({
    userId: {
	type: Schema.Types.ObjectId,
	ref: "users"
    },
    shipping: {
	type: Schema.Types.ObjectId,
	ref: "shipments",
	default: null
    },
    paypalOrderId: {
	type: String,
	required: true
    },
    address: {
	_id: false,
	fullName: String,
	postalCode: String,
	state: String,
	municipality: String,
	suburb: String,
	street: String,
	outdoorNumber: String,
	interiorNumber: String,
	phoneNumber: String,
	additionalInformation: String
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
	enum: ["PENDING", "SHIPPING", "COMPLETED"],
	default: "PENDING"
    }
}, { timestamps: true });

orderSchema.virtual("user", {
    ref: "users",
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

orderSchema.plugin(mongoosePaginate);

orderSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IOrder, IOrderModel>("orders", orderSchema);
