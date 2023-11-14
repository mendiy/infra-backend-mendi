import { insertUsersDB, chackUserLoginDB, checksIfUsernameExists } from '../action/userFunctions.js';
import { check, validationResult } from "express-validator";
import { connectToDatabase } from "../db/dbConnect.js"


const insertUserControllerMiddleware = [
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Please provide a password that is greater than 8 characters").isLength({ min: 8 })
];

const insertUserController = async (req, res) => {
  //connectToDatabase();
  console.log(5555555555);
  const data = req.body;
  console.log(data);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  const user = await checksIfUsernameExists(data);
  if (user) {
    return res.status(400).json({ errors: ['This user already exists'] })
  } else {
    try {
      const success = await insertUsersDB(data);
      if (success) {
        return res.status(201).json({ message: 'User inserted successfully', data: success });
      } else {
        return res.status(500).json({ error: 'User insertion failed' });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};


const chackUserLoginController = async (req, res) => {
  //connectToDatabase();
  const data = req.body
  console.log(data);
  const result = await chackUserLoginDB(data)
  if (result) {
    return res.status(400).json({ errors: result });
  }
  return res.status(200).send({ message: "You connected to success", token: data });
};


export { insertUserController, insertUserControllerMiddleware, chackUserLoginController };
