import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string
}

const categorySchema = new Schema({
    name: String
});

export default mongoose.model<ICategory>("categories", categorySchema);