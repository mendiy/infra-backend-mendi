import express from "express"
import bodyParser from "body-parser";
import dotenv from "dotenv"
import {connectToDatabase} from "./db/dbConnect.js"
import { insertUserController, insertUserControllerMiddleware, chackUserLoginController } from "./controllers/userController.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

connectToDatabase();

app.post('/register', insertUserControllerMiddleware, insertUserController)
app.get('/login', chackUserLoginController)


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
