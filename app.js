import express from "express"
import bodyParser from "body-parser";
import dotenv from "dotenv"
import { connectToDatabase } from "./db/dbConnect.js"
import cors from "cors"
import verifyToken from "./middelWare/auth_JWT.js"
import UsersRoutes from "./Routes/UsersRouts.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());
//app.use(verifyToken);
app.use("/api/users", UsersRoutes)

connectToDatabase();


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
