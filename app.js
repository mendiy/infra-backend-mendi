import express from "express"
import bodyParser from "body-parser";
import dotenv from "dotenv"
import { connectToDatabase } from "./db/dbConnect.js"
import { insertUserController, insertUserControllerMiddleware, chackUserLoginController, getUserNameController } from "./controllers/userController.js"
import cors from "cors"
import jwtMiddleware from "./middelWare/auth_JWT.js"
//import usersController from "./controllers/usersController.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());
//app.use(usersController());

//app.post('/revoke', revokeToken);
//app.use(checkRevoked);

// Endpoint to receive the token from the client
app.get('/validate-token',jwtMiddleware)


connectToDatabase();


app.post('/register', insertUserControllerMiddleware, insertUserController)
app.post('/login', chackUserLoginController)
app.get('/avatar', getUserNameController)


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
