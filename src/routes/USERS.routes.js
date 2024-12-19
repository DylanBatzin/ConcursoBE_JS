import { Router } from "express";
import { getUsers, getUser, postUser, putUser, deleteUser, login } from "../controllers/USERS.controllers.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = Router();

router.post('/users/login', login);

router.get("/users",authenticateJWT,getUsers );

router.get("/users/:Uuid", authenticateJWT, getUser);

router.post("/users", postUser);

router.put("/users/:Uuid", authenticateJWT, putUser);

router.delete("/users/:Uuid", authenticateJWT, deleteUser); 

export default router;