import { Router } from "express";

import messages from "./messages";

import withJWTAuth from "../../utils/middlewares/withJWTAuth";
import withAdmin from "../../utils/middlewares/withAdmin";
import checkIfTheChatExists from "../../utils/middlewares/checkIfTheChatExists";

import getAll from "./getAll";
import createOne from "./createOne";

const router = Router();

router.use("/messages/", withJWTAuth, checkIfTheChatExists, messages);

router.get("/", withJWTAuth, withAdmin, getAll);

router.post("/", withJWTAuth, withAdmin, createOne);

export default router;
