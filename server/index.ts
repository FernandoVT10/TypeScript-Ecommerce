import mongoose from "mongoose";
import next from "next";
import app from "./app";

mongoose.connect("mongodb://localhost:27017/TypeScriptEcommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });

const port = process.env.PORT || 3000;
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return handle(req, res); 
    });

    app.listen(port, () => console.log("Server running on http://localhost:3000"));
});
