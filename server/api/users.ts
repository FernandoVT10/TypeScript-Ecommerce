import mongoose from "mongoose";
import Router from "express";

import User, { IUser } from "../models/User";

import withJWTAuth from "../utils/middlewares/withJWTAuth";
import withSuperAdmin from "../utils/middlewares/withSuperAdmin";

const router = Router();

router.get("/", withJWTAuth, withSuperAdmin, async (req, res) => {
    const { search } = req.body;
    
    try {
        const query = {}

        if(search) {
            const regex = new RegExp(`^${search}`, "i");

            Object.assign(query, {
                $or: [
                    { username: regex },
                    { name: regex }
                ]
            });
        }

        const users = await User.find(query);

        res.json({ data: { users } });
    } catch (err) {
        res.json({
            status: 500,
            error: "Internal Server Error",
            message: err.message,
            path: req.originalUrl
        });
    }
});

interface IUpdateUserInput {
    permits: IUser["permits"]
}

router.put("/:userId", withJWTAuth, withSuperAdmin, async (req, res) => {
    const { userId } = req.params;
    const { permits } = req.body as IUpdateUserInput;

    try {
        const user = await User.findById(userId);

        if(!user) {
            return res.json({
                status: 404,
                error: "Not found",
                message: `The user '${userId}' doesn't exist`,
                path: req.originalUrl
            });
        }

        if(permits) {
            user.permits = permits;
        }

        const updatedUser = await user.save();

        res.json({ data: { updatedUser } })
    } catch(err) {
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
});

export default router;
