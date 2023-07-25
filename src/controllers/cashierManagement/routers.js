import { Router } from "express";
import path from "path";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";
import { createProfileUploader } from "../../helpers/uploader.js";

const uploader = createProfileUploader(
  path.join(process.cwd(), "public", "images", "profiles")
);

//@import controllers
import * as CashierManagement from "./index.js";

//@define route
const router = Router();
//@Cashier Management
router.post(
  "/cashier-management",
  verifyAdmin,
  uploader.fields([{ name: "data" }, { name: "file" }]),
  CashierManagement.register
);
router.get(
  "/cashier-management",
  verifyAdmin,
  CashierManagement.getCashierInfo
);
router.patch(
  "/cashier-management/:id",
  verifyAdmin,
  CashierManagement.changeStatusCashier
);

router.put(
  "/cashier-management/:id",
  verifyAdmin,
  CashierManagement.updateProfile
);

export default router;
