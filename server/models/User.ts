import mongoose, { Schema, Document, Model } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export interface IUser extends Document {
    name: string,
    username: string,
    email: string,
    password: string,
    permits?: "USER" | "ADMIN" | "SUPERADMIN",
    active?: boolean,
    activeToken: string
}

interface IUserModel extends Model<IUser> {
    paginate(query?: object, options?: object): Promise<any>;
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
    permits: {
    	type: String,
	enum: ["USER", "ADMIN", "SUPERADMIN"],
	default: "USER"
    },
    active: {
	type: Boolean,
	default: false
    },
    activeToken: String
}, { timestamps: true });

userSchema.plugin(mongoosePaginate);

export default mongoose.model<IUser, IUserModel>("users", userSchema);
