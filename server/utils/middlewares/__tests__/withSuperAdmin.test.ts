import { Request, Response } from "express";

import User from "../../../models/User";

import withSuperAdmin from "../withSuperAdmin";

setupTestDB("middlewares_withSuperAdmin_test");
mockAuthentication();

describe("/utils/middlewares/withSuperAdmin", () => {
    it("should call next when the user has 'SUPERADMIN' permits", async () => {
	const nextMock = jest.fn();
        const { _id } = await User.findOneAndUpdate({}, { permits: "SUPERADMIN" });

        await withSuperAdmin({ userId: _id } as Request, {} as Response, nextMock);

	expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error when the user doesn't have enough permissions", async () => {
        const jsonMock = jest.fn();

        const { _id } = await User.findOneAndUpdate({}, { permits: "ADMIN" });

        await withSuperAdmin(
            { userId: _id, originalUrl: "/test/url/" } as Request,
            { json: jsonMock } as any as Response,
            jest.fn()
        );

        expect(jsonMock).toHaveBeenCalledWith({
            status: 401,
            error: "No permissions",
            message: "You don't have enough permissions to enter here",
            path: "/test/url/"
        });
    });
});
