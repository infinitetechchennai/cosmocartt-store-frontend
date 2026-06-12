import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  action: String,
  time: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff"
  },
  
  permissions: {
    type: [String],
    default: []
  },
  
  status: {
    type: String,
    default: "Active"
  },
  
  activityLogs: [activitySchema],
  
  lastLogin: Date

}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);