import { Request, Response } from "express";

import User from "../../models/User";

export default async (req: Request, res: Response) => {
    const { activeToken } = req.params;

    try {
	const user = await User.findOne({ activeToken });

	if(!user) {
	    res.json({
		status: 404,
		error: "User not found",
		message: "The activation token doesn't exists",
		path: `/api/account/activate/${activeToken}`
	    });

	    return;
	}

	user.active = true;
	user.save();

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
}

