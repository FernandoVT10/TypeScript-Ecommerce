import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    title: string,
    images: string[],
    price: number,
    discount: number,
    inStock: number,
    arrivesIn: string,
    warranty: string,
    description: string
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
    }
}, { timestamps: true });

export default mongoose.model<IProduct>("products", productSchema);