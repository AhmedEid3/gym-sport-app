const mongoose = require("mongoose");

// Admin schema
const adminSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: Date, required: true }
});

// Create Client Model
const Admin = mongoose.model("Admin", adminSchema);
