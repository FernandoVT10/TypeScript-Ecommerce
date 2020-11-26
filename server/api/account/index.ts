import { Router } from "express";

import register from "./register";
import login from "./login";
import activate from "./activate";
import isLogged from "./isLogged";

const router = Router();

router.post("/register/", register);
router.post("/login/", login);
router.post("/activate/:activeToken", activate);
router.get("/isLogged/", isLogged);

export default router;
