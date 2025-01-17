import { Router } from "express";
import { getProducts, getProduct, postProduct, deleteProduct, putProduct,getAvailableProducts } from "../controllers/PRODUCTS.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";
import { uploadSingleImage } from "../middleware/multer.js";

const router = Router();

router.get("/products/available", authenticateJWT, getAvailableProducts);

router.get("/products", authenticateJWT,getProducts);

router.get("/products/:Uuid", authenticateJWT, getProduct);

router.post("/products",authenticateJWT,uploadSingleImage, postProduct);

router.put("/products/:ProductUuid",authenticateJWT,uploadSingleImage, putProduct);

router.delete("/products/:Uuid", authenticateJWT, deleteProduct);



export default router;
