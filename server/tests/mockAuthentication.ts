import jwt from "jsonwebtoken";
import { mocked } from "ts-jest/utils";

import User from "../models/User";

jest.mock("jsonwebtoken");

const mockedJWTVerify = mocked(jwt.verify);

const USER_MOCK = {
    name: "test",
    username: "test777",
    email: "test@gmail.com",
    password: "secret",
    activeToken: "test token"
}

export default () => {
    beforeEach(async () => {
	const user = await User.create(USER_MOCK);

	mockedJWTVerify.mockReset();
	mockedJWTVerify.mockImplementation(() => ({ userId: user._id }));
    });
}
