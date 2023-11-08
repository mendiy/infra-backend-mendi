import  { User } from '../db/userSchema.js';
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";


const MAX_RETRIES = 3; // You can adjust this value
const RETRY_INTERVAL = 1000; // You can adjust this interval

async function insertUsersDB(data) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {

      const token = await JWT.sign(data.email, 'megobb');
      const password = await bcrypt.hash(data.password, 10);

      const user = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: password,
        token: token,
        title: null
      });
      const result = await user.save();
      
      console.log(`${result._id} document inserted.`);
      return token ;
    } catch (e) {
      if (e.message.includes('buffering timed out')) {
        console.warn(`Insertion attempt ${retries + 1} timed out. Retrying...`);
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        if (e.name === 'ValidationError' && e.errors.email) {
          // Handle the email validation error
          const errorMessage = e.errors.email.message;
          console.error('Email validation error:', errorMessage);
          throw new Error(errorMessage);
        } else {
          console.error('Error while inserting user:', e);
          throw new Error('User insertion failed');
        }
      }
    }
  }
  console.error(`User insertion failed after ${MAX_RETRIES} retries.`);
  throw new Error('User insertion failed');
}



  
  async function chackUserLoginDB(data) {

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const documents = await checksIfUsernameExists(data);
        if (!documents) {
          console.log("Username does not exist, you can register!");
          return "Username does not exist, you can register!"
        } else {
          const isPasswordValid = await bcrypt.compare(data.password, documents.password);
            if (isPasswordValid) {
              return false
            } else {
              console.log("Email or Password is incorrect.");
              return "Email or Password is incorrect."
            }
        }
      } catch (e) {
        if (e.message.includes('buffering timed out')) {
          console.warn(`Query attempt ${retries + 1} timed out. Retrying...`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        } else {
          console.error('Error while querying users:', e);
          throw new Error('An error occurred: ' + e);
        }
      }
    }
    console.error(`Query failed after ${MAX_RETRIES} retries.`);
    throw new Error('An error occurred during the query.');
  }


  async function checksIfUsernameExists(data) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const query = {
          email: data.email
        };
  
        const documents = await User.findOne(query);
        if (!documents) {
          console.log(false);
          return false;
        } else {
          console.log('This user already exists');
          return documents;
        }
      } catch (e) {
        if (e.message.includes('buffering timed out')) {
          console.warn(`Query attempt ${retries + 1} timed out. Retrying...`);
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
        } else {
          console.error('Error while querying users:', e);
          throw new Error('An error occurred: ' + e);
        }
      }
    }
    console.error(`Query failed after ${MAX_RETRIES} retries.`);
    throw new Error('An error occurred during the query.');
  }

  export { insertUsersDB, chackUserLoginDB, checksIfUsernameExists };
