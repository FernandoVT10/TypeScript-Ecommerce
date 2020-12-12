import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Error } from "mongoose";

import User, { IUser } from "../../models/User";

import { MAIL_CONFIG } from "../../config";
import transporter from "../../utils/services/mail";
import loadEmailTemplate from "../../utils/services/loadEmailTemplate";

const SALT_ROUNDS = 10;

interface IRegisterInput {
    name: IUser["name"],
    username: IUser["username"],
    email: IUser["email"],
    password: string
}

export default async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body as IRegisterInput;
    
    try {
	if(password.length < 4) {
	    return res.json({
		status: 400,
		error: "Validation Error",
		message: "The password must contain 4 or more characters",
		path: req.originalUrl
	    });
	}

	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

	const activeToken = crypto.randomBytes(20).toString("hex");

	await User.create({
	    name,
	    username,
	    email,
	    password: passwordHash,
	    activeToken
	});

	const url = `${req.protocol}://${req.get("host")}`;
	const verificationEmail = loadEmailTemplate("verificationEmail", { url, activeToken });

	await transporter.sendMail({
	    from: MAIL_CONFIG.username,
	    to: email,
	    subject: "Email Verification - TypeScriptEcomerce",
	    html: verificationEmail
	});

	res.json({
	    data: {
	       message: "You have successfully registered"
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
		path: req.originalUrl
	    });

	    return;
	}

	if(err instanceof Error) {
	    res.json({
		status: 400,
		error: "Validation Error",
		message: err.message,
		path: req.originalUrl
	    });

	    return;
	}

	res.json({
	    status: 500,
	    error: "Internal server error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
}
