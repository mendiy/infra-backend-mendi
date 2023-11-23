import { User } from '../db/userSchema.js';
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";


const MAX_RETRIES = 3; // You can adjust this value
const RETRY_INTERVAL = 1000; // You can adjust this interval

async function insertUsersDB(data) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {

      const password = await bcrypt.hash(data.password, 10);

      const user = new User({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: password,
        title: data.title,
      });

      const result = await user.save();

      console.log(`${result._id} document inserted.`);
      return user;
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

async function getUpdateUserTitleDB(data) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const filter = { email: data.email };
      const update = { title: data.title };

      // Add the { runValidators: true } option to enforce schema validation
      const result = await User.findOneAndUpdate(filter, update, { runValidators: true });

      if (!result) {
        // Handle the case where no user was found with the provided email
        console.error("User not found");
        return false;
      }

      return true;
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


async function chackUserLoginDB(data) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const documents = await checksIfUsernameExists(data);
      if (!documents) {
        console.log("Username does not exist, you can register!");
        return false //"Username does not exist, you can register!"
      } else {
        const isPasswordValid = await bcrypt.compare(data.password, documents.password);
        if (isPasswordValid) {

          // Set the expiration time (in seconds)
          const expiresIn = 86400; // 24 hour

          const payload = {
            email: data.email,
            timestamp: Date.now(),
          };

          const token = JWT.sign(payload, 'megobb', { expiresIn }, { algorithm: "HS256" });

          console.log(token);
          return token
        } else {
          console.log("Email or Password is incorrect.");
          return false
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

      const documents = await User.findOne(query).select('-password');
      
      if (!documents) {
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


async function allUsersControllerDB(data) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const documents = await User.find().select('-password');
      if (!documents) {
        return false;
      } else {
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


async function findUserDB(data) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const query = {
        $or: [
          { email: data.email },
          { username: data.username },
          { firstName: { $regex: new RegExp(data.firstName, 'i') } },
          { lastName: { $regex: new RegExp(data.lastName, 'i') } }
        ]
      };

      const documents = await User.find(query).select('-password');

      if (!documents) {
        return null; // User doesn't exist
      } else {
        console.log('User found:', documents);
        return documents; // User exists
      }
    } catch (e) {
      if (e instanceof MongoError && e.message.includes('buffering timed out')) {
        console.warn(`Query attempt ${retries + 1} timed out. Retrying...`);
        retries++;
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        console.error('Error while querying users:', e);
        throw new Error('An error occurred during the query.');
      }
    }
  }

  console.error(`Query failed after ${MAX_RETRIES} retries.`);
  throw new Error('An error occurred during the query.');
}

export {
  insertUsersDB,
  getUpdateUserTitleDB,
  chackUserLoginDB,
  checksIfUsernameExists,
  allUsersControllerDB,
  findUserDB
};