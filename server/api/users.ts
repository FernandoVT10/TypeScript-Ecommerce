import { Router } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../config";

import User, { IUser } from "../models/User";

const SALT_ROUNDS = 10;
const EXPIRE_TIME = 60 * 60 * 24 * 30;

const router = Router();

interface IRegisterInput {
    name: IUser["name"],
    username: IUser["username"],
    email: IUser["email"],
    password: IUser["password"]
}

router.post("/register/", async (req, res) => {
    const { name, username, email, password } = req.body as IRegisterInput;

    try {
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

	await User.create({ name, username, email, password: passwordHash });

	res.json({
	    data: {
	       message: "You have successfully registered "
	    }
	});
    } catch(err) {
	if(err.name === "MongoError" && err.code === 11000) {
	    let errorMessage = err.message;

	    if(err.keyValue.username) {
		errorMessage = "The username already exists";
	    } else {
		errorMessage = "The email already exists";
	    }

	    res.json({
		status: 400,
		error: "Validation Error",
		message: errorMessage,
		path: "/api/users/register/"
	    });

	    return;
	}

	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: "/api/users/register/"
	});
    }
});

router.post("/login/", async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
	const user = await User.findOne({ $or: [
	    { username: usernameOrEmail }, { email: usernameOrEmail }
	] });

	if(!user) {
	    res.json({
		status: 404,
		error: "User not found",
		message: "The email or username don't exists",
		path: "/api/users/login/"
	    });

	    return;
	}

	if(user.activationStatus === "Pending") {
	    res.json({
		status: 400,
		error: "User not activated",
		message: "This user has not been confirmed",
		path: "/api/users/login/"
	    });

	    return;
	}

	const match = await bcrypt.compare(password, user.password);
	
	if(!match) {
	    res.json({
		status: 400,
		error: "Validation Error",
		message: "The password is incorrect",
		path: "/api/users/login/"
	    });

	    return;
	}

	const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: EXPIRE_TIME  });

	res.cookie("token", token, {
	    maxAge: EXPIRE_TIME * 1000
	}).send({
	    data: {
		message: "You have successfully logged in"
	    }
	});
    } catch(err) {
	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: "/api/users/login/"
	});
    }
});

export default router;
