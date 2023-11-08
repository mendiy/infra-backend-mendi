import mongoose from "mongoose";
import dotenv from "dotenv"

// dotenv.config({
//   path: '../.env'
// });

const connectToDatabase = async () => {
  const userName = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const cluster = process.env.CLUSTER_URI;
  const dbName = 'ToDoDB';

  const connectionURI = `mongodb+srv://${userName}:${password}${cluster}${dbName}`;

  try {
    await mongoose.connect(connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

export { connectToDatabase };