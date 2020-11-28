import mongoose, { Schema, Document } from "mongoose";

import { IUser } from "./User";

const POSTAL_CODE_REGEX = /^([0-9]{5})([\-]{1}[0-9]{4})?$/;
const PHONE_NUMBER_REGEX = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export interface IAddress extends Document {
    userId: IUser["_id"],
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
}

const addressSchema = new Schema({
    userId: {
	type: Schema.Types.ObjectId,
	ref: "users"
    },
    fullName: {
	type: String,
	maxlength: 200,
	required: true
    },
    postalCode: {
	type: String,
	validate: {
	    validator: (value: string) => POSTAL_CODE_REGEX.test(value)
	}
    },
    state: {
	type: String,
	maxlength: 200,
	required: true
    },
    municipality: {
	type: String,
	maxlength: 200,
	required: true
    },
    suburb: {
	type: String,
	maxLength: 200,
	required: true
    },
    street: {
	type: String,
	maxlength: 500,
	required: true
    },
    outdoorNumber: {
	type: String,
	maxlength: 6,
	required: true
    },
    interiorNumber: {
	type: String,
	maxlength: 6,
	default: "W/O"
    },
    phoneNumber: {
	type: String,
	validate: {
	    validator: (value: string) => PHONE_NUMBER_REGEX.test(value)
	}
    },
    additionalInformation: {
	type: String,
	maxlength: 1000,
	default: ""
    }
});

export default mongoose.model<IAddress>("addresses", addressSchema);
