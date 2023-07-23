import { isAdmin } from "../../middlewares/auth.js";
import { upgradeToAdminSchema, validate } from "../../validators/user.js";
import { Router } from "express";
import { upgradeToAdmin } from "./controller.js";

const router = Router();

router.put(
  "/:id",
  isAdmin,
  async (req, res, next) => {
    try {
      await validate(upgradeToAdminSchema, req.body);
      next();
    } catch (err) {
      res.status(err.status).json({ message: err.message, errors: err.errors });
    }
  },
  upgradeToAdmin,
);

export default router;
