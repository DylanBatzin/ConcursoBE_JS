import { Router } from "express";
import { getUsers, getUser, postUser, putUser, deleteUser, login, getUserByEmail } from "../controllers/USERS.controllers.js";
import { authenticateJWT, authorizeRole } from "../middleware/authenticate.js";

const router = Router();

router.post("/users/byEmail", authenticateJWT, getUserByEmail);

router.post('/users/login', login);

router.get("/users", authenticateJWT, authorizeRole('D75D5E20-A13A-45CC-81C1-64A46C0B482A'), getUsers );

router.get("/users/:Uuid", authenticateJWT, getUser);

router.post("/users", postUser);

router.put("/users/:Uuid",authenticateJWT ,putUser);

router.delete("/users/:Uuid", authenticateJWT, deleteUser); 

export default router;