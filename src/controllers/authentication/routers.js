import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";

//@import controllers
import * as AuthControllers from "./index.js";

//@define route
const router = Router();

//@Authentication
router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.get("/verify", AuthControllers.verifyAccount);
router.patch("/change-default-password", AuthControllers.changeDefaultPassword);
router.put("/forget-password", AuthControllers.forgetPassword);
router.patch("/reset-password", AuthControllers.ressetPassword);

export default router;
