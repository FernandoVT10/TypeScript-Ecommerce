import { Router } from "express";

import create from "./create";
import execute from "./execute";
import cancel from "./cancel";

const router = Router();

router.post("/create/", create);
router.post("/execute/", execute);
router.post("/cancel/", cancel);

export default router;
