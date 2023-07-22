import {Router} from "express";
import {createProduct, deleteProduct, getProduct, getProducts, updateProduct} from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import productValidator from "../../validators/product.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/",
    async (req, res, next) => {
        try {
            await productValidator.validate(productValidator.createProductSchema, req.body)
            next();
        } catch (err) {
            res.status(err.status).json({message: err.message, errors: err.errors});
        }
    },
    authMiddleware.isAdmin, createProduct);
router.put("/:id", authMiddleware.isAdmin, updateProduct);
router.delete("/:id", authMiddleware.isAdmin, deleteProduct);

export default router;