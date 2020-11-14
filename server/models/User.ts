import mongoose, { Schema, Document } from "mongoose";

const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export interface IUser extends Document {
    name: string,
    username: string,
    email: string,
    password: string,
    active?: boolean,
    activeToken: string
}

const userSchema = new Schema({
    name: {
        type: String,
	maxlength: 200,
        required: true
    },
    username: {
	type: String,
	maxlength: 30,
	required: true,
	unique: true
    },
    email: {
	type: String,
	validate: {
	    validator: (email: string) => EMAIL_VALIDATION_REGEX.test(email),
	    message: "The email is invalid"
	},
	required: true,
	unique: true
    },
    password: {
	type: String,
	required: true
    },
    active: {
	type: Boolean,
	default: false
    },
    activeToken: String
}, { timestamps: true });

export default mongoose.model<IUser>("users", userSchema);
