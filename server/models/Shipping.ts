import mongoose, { Schema, Document } from "mongoose";

export interface IShipping extends Document {
    arrivesIn?: string,
    history: Array<{
    	content: string,
	createdAt?: Date
    }>
}

const shippingSchema = new Schema({
    arrivesIn: {
        type: String,
	default: null
    },
    history: [{
	_id: false,
	content: String,
	createdAt: {
	    type: Date,
	    default: () => Date.now()
	}
    }]
});

export default mongoose.model<IShipping>("shipments", shippingSchema);
