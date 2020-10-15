import mongoose, { Schema, Document } from "mongoose";

export interface ICarousel extends Document {
    image: string,
    link: string
}

const carouselSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

export default mongoose.model<ICarousel>("carousel", carouselSchema);