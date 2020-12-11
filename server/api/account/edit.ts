import mongoose from "mongoose";

import { Request, Response } from "express";

import User, { IUser } from "../../models/User";

interface IEditInput {
    name: IUser["name"],
    username: IUser["username"],
    email: IUser["email"]
}

export default async (req: Request, res: Response) => {
    const { name, username, email } = req.body as IEditInput;

    try {
        const user = await User.findById(req.userId);

	user.name = name;
	user.username = username;
	user.email = email;

	await user.save();

	res.json({
	    data: {
		message: "The account has been edited successfully"
	    }
	});
    } catch (err) {
	if(err instanceof mongoose.Error) {
	    return res.json({
		status: 400,
		error: "Bad Request",
		message: err.message,
		path: req.originalUrl
	    });
	}

	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
}
