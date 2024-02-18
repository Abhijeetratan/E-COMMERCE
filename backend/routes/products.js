import express from "express";
import { getProducts, newProduct, getProductDetails, UpdateProduct, DeleteProduct } from "../controllers/productControllers.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(UpdateProduct);
router.route("/products/:id").delete(DeleteProduct);

export default router;
