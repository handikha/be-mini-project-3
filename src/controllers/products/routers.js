import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../midlewares/token.verify.js";
import { createThumbnailUploader } from "../../helpers/uploader.js";
import path from "path";

import * as products from "./index.js";

const uploader = createThumbnailUploader(
  path.join(process.cwd(), "public", "images", "thumbnails")
);

const router = Router();

router.post(
  "/products",
  uploader.fields([{ name: "data" }, { name: "file" }]),
  products.createProduct
);
router.get("/products", products.getAllProducts); //not verify admin
router.get("/products/:id", products.getProductById);
router.patch(
  "/products/:id",
  uploader.fields([{ name: "data" }, { name: "file" }]),
  products.updateProduct
);
router.delete("/products/:id", products.deleteProduct);

export default router;
