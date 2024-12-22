import { Router } from "express";
import { getOrders, getOrder, deleteOrder, updateOrder, createOrder } from "../controllers/ORDERS.controller.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.get("/orders",authenticateJWT,getOrders);

router.get("/orders/:Uuid",authenticateJWT, getOrder);

router.delete("/orders/:Uuid",authenticateJWT, deleteOrder);

router.put("/orders/:Uuid",authenticateJWT, updateOrder);

router.post("/orders",authenticateJWT, createOrder);

export default router;