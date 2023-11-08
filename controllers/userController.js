import { insertUsersDB, chackUserLoginDB, checksIfUsernameExists } from '../action/userFunctions.js';
import {check, validationResult} from "express-validator";

const insertUserControllerMiddleware = [
  check("email", "Please provide a valid email").isEmail(),
  check("password", "Please provide a password that is greater than 8 characters").isLength({ min: 8 })
];

const insertUserController = async (req, res) => {
      const data = req.query;
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });    
      }

      const user = await checksIfUsernameExists(data);
      if(user){
        res.status(400).json({ errors:['This user already exists']})
      }else{
        try {
          const success = await insertUsersDB(data);
          if (success) {
            res.status(201).json({ message: 'User inserted successfully', token: success });
          } else {
            res.status(500).json({ error: 'User insertion failed' });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
    }
  };


const chackUserLoginController = async (req, res) => {
  const data = req.query
  const result = await chackUserLoginDB(data)
  if (result) {
    return res.status(400).json({ errors: result });
  }
    return res.status(200).send("You connected to success");
  };

  export { insertUserController, insertUserControllerMiddleware, chackUserLoginController };
