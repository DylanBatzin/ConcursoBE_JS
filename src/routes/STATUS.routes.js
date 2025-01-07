import { Router } from "express";
import { getStatus , getStatusById, postStatus, putStatus, deleteStatus } from "../controllers/STATUS.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.get("/status", authenticateJWT,getStatus);

router.get("/status/:Uuid", authenticateJWT, getStatusById);

router.post("/status",authenticateJWT,postStatus);

router.put("/status/:Uuid",authenticateJWT, putStatus);

router.delete("/status/:Uuid", authenticateJWT,deleteStatus);


export default router;