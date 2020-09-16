import { Express } from "express";

import users from "./api/users";

export default (app: Express): void => {
    app.use("/api/users/", users);
}