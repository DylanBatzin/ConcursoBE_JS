import { Router } from "express";
import { getRoles, getRole, postRole, putRole, deleteRole } from "../controllers/ROLE.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.get("/roles", authenticateJWT,getRoles);

router.get("/roles/:Uuid", authenticateJWT, getRole);

router.post("/roles", authenticateJWT, postRole);

router.put("/roles/:Uuid", authenticateJWT, putRole);

router.delete("/roles/:Uuid", authenticateJWT, deleteRole); 

export default router;