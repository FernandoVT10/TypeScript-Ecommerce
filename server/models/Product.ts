import mongoose, { Schema, Document, Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ICategory } from "./Category";

export interface IProduct extends Document {
    title: string,
    images: string[],
    price: number,
    discount: number,
    inStock: number,
    arrivesIn: string,
    warranty: string,
    description: string,
    categories: ICategory["_id"]
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
    images: [String],
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    inStock: {
        type: Number,
        required: true
    },
    arrivesIn: {
        type: String,
        maxlength: 30,
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

productSchema.plugin(mongoosePaginate);

export default mongoose.model<IProduct, IProductModel>("products", productSchema);