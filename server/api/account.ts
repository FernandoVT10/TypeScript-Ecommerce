import { Router } from "express";

import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Error } from "mongoose";

import transporter from "../utils/services/mail";

import { JWT_SECRET_KEY, MAIL_CONFIG } from "../config";

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

	const activeToken = crypto.randomBytes(20).toString("hex");

	await User.create({
	    name,
	    username,
	    email,
	    password: passwordHash,
	    activeToken
	});

	await transporter.sendMail({
	    from: MAIL_CONFIG.username,
	    to: email,
	    subject: "Email Verification - TypeScriptEcomerce",
	    html: `<a href="http://localhost:3000/api/account/activate/${activeToken}">Activate account</a>`
	});

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
		path: "/api/account/register/"
	    });

	    return;
	}

	if(err instanceof Error) {
	    res.json({
		status: 400,
		error: "Validation Error",
		message: err.message,
		path: "/api/account/register/"
	    });

	    return;
	}

	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: "/api/account/register/"
	});
    }
});

router.get("/activate/:activeToken", async (req, res) => {
    const { activeToken } = req.params;

    try {
	const user = await User.updateOne({ activeToken }, {
	    $set: { active: true }
	});

	if(!user) {
	    res.json({
		status: 404,
		error: "User not found",
		message: "The activation token don't exists",
		path: `/api/account/activate/${activeToken}`
	    });

	    return;
	}

	res.json({
	    data: {
		message: "Your account has been activated"
	    }
	});
    } catch(err) {
	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: `/api/account/activate/${activeToken}`
	});
    }
});

interface ILoginInput {
    usernameOrEmail: IUser["username"] | IUser["email"],
    password: IUser["password"]
}

router.post("/login/", async (req, res) => {
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
	    path: "/api/account/login/"
	});
    }
});

export default router;
