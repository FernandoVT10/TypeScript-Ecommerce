import { Request, Response, NextFunction } from "express";
import User from "../../models/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
	const user = await User.findById(req.userId);

	if(user.permits !== "ADMIN" && user.permits !== "SUPERADMIN") {
	    return res.json({
		status: 401,
		error: "No permissions",
		message: "You don't have enough permissions to enter here",
		path: req.originalUrl
	    });
	}
	
	next();
    } catch (err) {
	res.json({
	    status: 500,
	    error: "Internal Server Error",
	    message: err.message,
	    path: req.originalUrl
	});
    }
}
