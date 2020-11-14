import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

routes(app);

export default app;
