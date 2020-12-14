import { Router } from "express";

import withJWTAuth from "../../utils/middlewares/withJWTAuth";

import addresses from "./addresses";

import register from "./register";
import login from "./login";
import activate from "./activate";
import getUserData from "./getUserData";
import edit from "./edit";
import changePassword from "./changePassword";
import notifications from "./notifications";

const router = Router();

router.use("/addresses/", withJWTAuth, addresses);

router.post("/register/", register);
router.post("/login/", login);
router.post("/activate/:activeToken", activate);
router.get("/getUserData/", withJWTAuth, getUserData);
router.put("/edit/", withJWTAuth, edit);
router.put("/changePassword/", withJWTAuth, changePassword);
router.use("/notifications/", withJWTAuth, notifications);

export default router;
