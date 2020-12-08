import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../config";

import User, { IUser } from "../../models/User";

const EXPIRE_TIME = 60 * 60 * 24 * 30;

interface ILoginInput {
    usernameOrEmail: IUser["username"] | IUser["email"],
    password: IUser["password"]
}

export default async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body as ILoginInput;

    try {
	const user = await User.findOne({ $or: [
	    { username: usernameOrEmail }, { email: usernameOrEmail }
	] });

	if(!user) {
	    res.json({
		status: 404,
		error: "User not found",
		message: "The email or username don't exists",
		path: "/api/account/login/"
	    });

	    return;
	}

	if(!user.active) {
	    res.json({
		status: 400,
		error: "User not activated",
		message: "This account has not been activated",
		path: "/api/account/login/"
	    });

	    return;
	}

	const match = await bcrypt.compare(password, user.password);
	
	if(!match) {
	    res.json({
		status: 400,
		error: "Validation Error",
		message: "The password is incorrect",
		path: "/api/account/login/"
	    });

	    return;
	}

	const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: EXPIRE_TIME  });

	res.json({
	    data: { token }
	});
    } catch(err) {
	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: "/api/account/login/"
	});
    }
}
