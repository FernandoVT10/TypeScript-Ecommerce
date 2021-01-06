import { Router } from "express";

import getAll from "./getAll";
import getOne from "./getOne";

import createOne from "./createOne";

import deleteOne from "./deleteOne";

import reviewsRoute from "./reviews";

import checkIfProductExist from "../../utils/middlewares/checkIfProductExist";
import withJWTAuth from "../../utils/middlewares/withJWTAuth";
import withAdmin from "../../utils/middlewares/withAdmin";

const router = Router();

router.get("/", getAll);
router.get("/:productId", getOne);

router.post("/", withJWTAuth, withAdmin, createOne);

router.delete("/:productId", withJWTAuth, withAdmin, deleteOne);

router.use("/:productId/reviews/", checkIfProductExist, reviewsRoute);

export default router;
