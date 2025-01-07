import { Router } from "express";
import { getOrders, getOrder, postOrder, putOrder, deleteOrder , getOrdersByStatus, getOrdersByUser } from "../controllers/ORDERS.controllers.js";
import { authenticateJWT ,authorizeRole} from "../middleware/authenticate.js";

const router = Router();

router.get("/orders/status",authenticateJWT, authorizeRole('D75D5E20-A13A-45CC-81C1-64A46C0B482A'), getOrdersByStatus);

router.get("/orders",authenticateJWT,getOrders);

router.get("/orders/:Uuid",authenticateJWT, getOrder);

router.delete("/orders/:Uuid",authenticateJWT, deleteOrder);

router.put("/orders/:Uuid",authenticateJWT, putOrder);

router.post("/orders", authenticateJWT,postOrder);

router.get("/orders/user/:userUuid", authenticateJWT, getOrdersByUser);


export default router;