import { Router } from "express";
import { getOrders, getOrder, postOrder, putOrder, deleteOrder } from "../controllers/ORDERS.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.get("/orders",authenticateJWT,getOrders);

router.get("/orders/:Uuid",authenticateJWT, getOrder);

router.delete("/orders/:Uuid",authenticateJWT, deleteOrder);

router.put("/orders/:Uuid",authenticateJWT, putOrder);

router.post("/orders", authenticateJWT,postOrder);

export default router;