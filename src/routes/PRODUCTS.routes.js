import { Router } from "express";
import { getProducts, getProduct, postProduct, putProduct, deleteProduct } from "../controllers/PRODUCTS.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";
import { uploadSingleImage, uploadMultipleImages } from "../middleware/multer.js";

const router = Router();

router.get("/products", authenticateJWT,getProducts);

router.get("/products/:Uuid", authenticateJWT, getProduct);

router.post("/products", uploadSingleImage, postProduct);

router.put("/products/:Uuid",  uploadSingleImage, putProduct);

router.delete("/products/:Uuid", authenticateJWT, deleteProduct);

export default router;
