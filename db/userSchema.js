import mongoose from "mongoose";
const allowedTitles = ['developer', 'project manager', 'product manager', 'designer', 'Other'];

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    enum: allowedTitles,
  },
  //token: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  maxTimeMS: 60000 // Set to 60 seconds (adjust as needed)
});


export const User = mongoose.model('User', userSchema);

