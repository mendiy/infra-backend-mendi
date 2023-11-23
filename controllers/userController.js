import {
  insertUsersDB,
  getUpdateUserTitleDB,
  chackUserLoginDB,
  checksIfUsernameExists,
  allUsersControllerDB,
  findUserDB
} from '../services/userService.js';
import { check, validationResult } from "express-validator";
import { connectToDatabase } from "../db/dbConnect.js"


const insertUserControllerMiddleware = [
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Please provide a password that is greater than 8 characters").isLength({ min: 8 })
];


const insertUserController = async (req, res) => {
  connectToDatabase();
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
        return res.status(400).json({ error: 'User insertion failed' });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};


const getUpdateUserTitleController = async (req, res) => {
  try {
    connectToDatabase();
    const data = req.body
    const result = await getUpdateUserTitleDB(data)
    if (result) {
      console.log("The update was successful");
      return res.status(200).json({ message: "The update was successful" });
    }
    return res.status(400).send({
      massage: "Username does not exist, you can register!"
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


const chackUserLoginController = async (req, res) => {
  try {
    connectToDatabase();
    const data = req.body
    const result = await chackUserLoginDB(data)
    if (result) {
      return res.status(200).json({ message: "You connected to success", token: result });
    }
    return res.status(400).send({ message: "Email or Password is incorrect." });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

const getUserNameController = async (req, res) => {
  try {
    connectToDatabase();
    const data = req.query
    console.log(data);
    const result = await checksIfUsernameExists(data)
    if (result) {
      return res.status(200).json({ firstName: result.firstName, lastName: result.lastName });
    }
    return res.status(400).send({
      massage: "Username does not exist, you can register!"
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const allUsersController = async (req, res) => {
  try {
    connectToDatabase();
    const result = await allUsersControllerDB()
    if (result) {
      return res.status(200).json({ result });
    }
    return res.status(400).send({
      massage: "Username does not exist, you can register!"
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const checksIfUsernameExistsController = async (req, res) => {
  try {
    connectToDatabase();
    const data = req.query;
    const result = await checksIfUsernameExists(data)
    console.log(result, 8888);
    if (result) {
      return res.status(200).json({ result });
    }
    return res.status(400).send({
      massage: "Username does not exist, you can register!"
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


const findUserController = async (req, res) => {
  try {
    connectToDatabase();
    const data = req.body;
    const result = await findUserDB(data)
    if (result) {
      return res.status(200).json({ result });
    }
    return res.status(400).send({
      massage: "Username does not exist, you can register!"
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  insertUserControllerMiddleware,
  insertUserController,
  getUpdateUserTitleController,
  chackUserLoginController,
  getUserNameController,
  allUsersController,
  checksIfUsernameExistsController,
  findUserController
};
