import { Router } from "express";
import { getCategories, getCategory, postCategory, putCategory, deleteCategory } from "../controllers/CATEGORIES.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.get("/categories", authenticateJWT,getCategories);

router.get("/categories/:Uuid", authenticateJWT, getCategory);

router.post("/categories", authenticateJWT, postCategory);

router.put("/categories/:Uuid", authenticateJWT, putCategory);

router.delete("/categories/:Uuid", authenticateJWT, deleteCategory); 

export default router;

