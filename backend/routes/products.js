import express from "express";
import { getProducts, newProduct, getProductDetails, UpdateProduct, DeleteProduct, createProductReview, getProductReviews } from "../controllers/productControllers.js";
import { authorizeRoles } from '../middlewares/auth.js';
import isAuthenticatedUser from '../middlewares/auth.js'
const router = express.Router();

router.route("/products").get(isAuthenticatedUser, authorizeRoles('admin'), getProducts);
router.route("/admin/products").post(isAuthenticatedUser, authorizeRoles('admin'), getProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles('admin'), getProducts);
router.route("/admin/products/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), getProducts);

router.route("/reviews").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

export default router;
