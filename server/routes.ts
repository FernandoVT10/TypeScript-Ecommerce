import { Express } from "express";

import account from "./api/account";
import carousel from "./api/carousel";
import promotions from "./api/promotions";
import products from "./api/products";
import categories from "./api/categories";

export default (app: Express) => {
    app.use("/api/account/", account);
    app.use("/api/carousel/", carousel);
    app.use("/api/promotions/", promotions);
    app.use("/api/products/", products);
    app.use("/api/categories/", categories);
}
