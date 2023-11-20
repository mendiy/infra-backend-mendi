import { Router } from "express";
import {
    insertUserControllerMiddleware,
    insertUserController,
    getUpdateUserTitleController,
    chackUserLoginController,
    getUserNameController,
    allUsersController
} from '../controllers/userController.js';


const UsersRoutes = Router();

UsersRoutes.post("/register", insertUserControllerMiddleware, insertUserController);
UsersRoutes.post('/userTitle', getUpdateUserTitleController);
UsersRoutes.post("/login", chackUserLoginController);
UsersRoutes.get("/avatar", getUserNameController);
UsersRoutes.get("/users", allUsersController); //Get all users

// UsersRoutes.post('/find-users', searchUseresController) //Search users by first name, last name, email, username (?)
// UsersRoutes.get('/me', infoCurrentUserController) //Get current user info by email
// UsersRoutes.get('/profile', SingelUserController) // Get single user by email

export default UsersRoutes;