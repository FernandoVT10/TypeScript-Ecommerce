import { Router } from "express";

import withAdmin from "../../../utils/middlewares/withAdmin";

import getAll from "./getAll";
import getAllByChatId from "./getAllByChatId";
import createOne from "./createOne";
import createOneByChatId from "./createOneByChatId";

const router = Router();

router.get("/", getAll);
router.get("/getAllByChatId/", withAdmin, getAllByChatId);

router.post("/", createOne);
router.post("/createOneByChatId/", withAdmin, createOneByChatId);

export default router;
