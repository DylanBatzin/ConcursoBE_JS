import { Router } from "express";
import { getStatus , getStatusById, postStatus } from "../controllers/STATUS.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.get("/status", authenticateJWT,getStatus);

router.get("/status/:Uuid", authenticateJWT, getStatusById);

router.post("/status",postStatus, authenticateJWT);

router.put("/status/:Uuid", authenticateJWT);

router.delete("/status/:Uuid", authenticateJWT);


export default router;