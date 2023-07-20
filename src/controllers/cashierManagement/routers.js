import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";

//@import controllers
import * as CashierManagement from "./index.js";

//@define route
const router = Router();
//@Cashier Management
router.post("/cashier-management", verifyAdmin, CashierManagement.register);
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

export default router;
