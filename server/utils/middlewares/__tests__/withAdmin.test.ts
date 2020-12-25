import { Request, Response } from "express";

import User from "../../../models/User";

import withAdmin from "../withAdmin";

setupTestDB("middlewares_withAdmin_test");
mockAuthentication();

describe("utils/middlewares/withAdmin", () => {
    it("should call next when the user has 'ADMIN' permits", async () => {
	const nextMock = jest.fn();
        const { _id } = await User.findOneAndUpdate({}, { permits: "ADMIN" });

	await withAdmin({ userId: _id } as Request, {} as Response, nextMock);
	expect(nextMock).toHaveBeenCalled();
    });

    it("should call next when the user has 'SUPERADMIN' permits", async () => {
	const nextMock = jest.fn();
        const { _id } = await User.findOneAndUpdate({}, { permits: "ADMIN" });

	await withAdmin({ userId: _id } as Request, {} as Response, nextMock);
	expect(nextMock).toHaveBeenCalled();
    });

    it("should return an error when the user doesn't have enough permissions", async () => {
	const jsonMock = jest.fn();

        const { _id } = await User.findOneAndUpdate({}, { permits: "USER" });

	await withAdmin(
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
