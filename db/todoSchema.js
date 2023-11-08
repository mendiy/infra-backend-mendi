import mongoose from "mongoose";

// Define the ToDo model schema (you can reuse your existing schema)
const todoTaskSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });

// Create a Mongoose model
export const TodoTask = mongoose.model("TodoTask", todoTaskSchema);
