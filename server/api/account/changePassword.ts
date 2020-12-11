import { Request, Response } from "express";

import bcrypt from "bcrypt";

import User from "../../models/User";

const SALT_ROUNDS = 10;

interface IChangePasswordInput {
    currentPassword: string,
    newPassword: string
}

export default async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body as IChangePasswordInput;

    try {
        const user = await User.findById(req.userId);

	if(newPassword.length < 4) {
	    return res.json({
		status: 400,
		error: "Validation Error",
		message: "The password must contain 4 or more characters",
		path: req.originalUrl
	    });
	}

	if(!await bcrypt.compare(currentPassword, user.password)) {
	    return res.json({
		status: 400,
		error: "Validation Error",
		message: "The password is incorrect",
		path: req.originalUrl
	    });
	}

	user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);

	await user.save();

	res.json({
	    data: {
		message: "The password has been changed successfully"
	    }
	});
    } catch (err) {
        res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
}
