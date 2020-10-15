import { Express } from "express";

import users from "./api/users";
import carousel from "./api/carousel";
import promotions from "./api/promotions";
import products from "./api/products";

export default (app: Express) => {
    app.use("/api/users/", users);
    app.use("/api/carousel/", carousel);
    app.use("/api/promotions/", promotions);
    app.use("/api/products/", products);
}