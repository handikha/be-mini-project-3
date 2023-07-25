import { Router } from "express";
import controller from "./controller.js";
import verifySignUp from "../../middlewares/verifySignUp.js";
import { loginSchema, registerSchema, validate } from "../../validators/auth.js";

const router = Router();

router.post(
  "/register",
  async (req, res, next) => {
    try {
      await validate(registerSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    }
  },
  verifySignUp.checkDuplicateUsernameOrEmail,
  controller.register,
);

router.post(
  "/login",
  async (req, res, next) => {
    try {
      await validate(loginSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    }
  },
  controller.login,
);

export default router;
