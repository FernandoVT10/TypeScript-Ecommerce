import mongoose, { Schema, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ICategory } from "./Category";

export interface IProduct extends Document {
    title: string,
    calification?: number,
    images: string[],
    price: number,
    discount?: number,
    inStock: number,
    warranty: string,
    description: string,
    categories: ICategory["_id"],
    discountedPrice?: number
}

interface IProductModel extends Model<IProduct> {
    paginate(query?: object, options?: object): Promise<any>;
}

const productSchema = new Schema({
    title: {
        type: String,
        maxlength: 100,
        required: true
    },
    calification: {
	type: Number,
	max: 5,
	default: 0
    },
    images: [String],
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
	max: 100,
	min: 0,
        default: 0
    },
    inStock: {
        type: Number,
        required: true
    },
    warranty: {
        type: String,
        maxlength: 250,
        required: true
    },
    description: {
        type: String,
        maxlength: 1000,
        required: true
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "categories"
    }]
}, { timestamps: true });

productSchema.virtual("discountedPrice").get(function() {
    const discount = (100 - this.discount) / 100;

    return this.price * discount;
})

productSchema.plugin(mongoosePaginate);

export default mongoose.model<IProduct, IProductModel>("products", productSchema);
