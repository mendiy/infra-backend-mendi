import { Router } from "express";
import {
    insertUserControllerMiddleware,
    insertUserController,
    getUpdateUserTitleController,
    chackUserLoginController,
    getUserNameController,
    allUsersController
} from '../controllers/userController.js';


const router = Router();

router.post("/register", insertUserControllerMiddleware, insertUserController);
router.post('/userTitle', getUpdateUserTitleController);
router.post("/login", chackUserLoginController);
router.get("/avatar", getUserNameController);
router.get("/users", allUsersController); //Get all users

// UsersRoutes.post('/find-users', searchUseresController) //Search users by first name, last name, email, username (?)
// UsersRoutes.get('/me', infoCurrentUserController) //Get current user info by email
// UsersRoutes.get('/profile', SingelUserController) // Get single user by email

export default router;