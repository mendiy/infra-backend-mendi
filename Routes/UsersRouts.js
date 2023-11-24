import { Router } from "express";
import verifyToken from "../middelWare/auth_JWT.js";
import {
    insertUserControllerMiddleware,
    insertUserController,
    getUpdateUserTitleController,
    chackUserLoginController,
    getUserNameController,
    allUsersController,
    getUserController,
    findUserController
} from '../controllers/userController.js';


const router = Router();

router.get("/verifyToken", verifyToken)
router.post("/register", insertUserControllerMiddleware, insertUserController);
router.post("/userTitle", getUpdateUserTitleController);
router.post("/login", chackUserLoginController);
router.get("/avatar", getUserNameController);
router.get("/users", allUsersController); //Get all users
router.get("/me", getUserController) //Get current user info by email
router.get("/profile", getUserController) // Get single user by email
router.post("/findUsers", findUserController) //Search users by first name, last name, email, username (?)

export default router;