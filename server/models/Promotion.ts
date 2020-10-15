import mongoose, { Schema, Document } from "mongoose";

export interface IPromotion extends Document {
    image: string,
    title: string,
    link: string
}

const promotionSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

export default mongoose.model<IPromotion>("promotions", promotionSchema);