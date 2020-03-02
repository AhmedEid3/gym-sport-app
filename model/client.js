const mongoose = require("mongoose");

// Client Schema
const clientSchema = new mongoose.Schema({
  clientId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  membershipStartingDate: { type: Date, required: true },
  membershipExpiryDate: { type: Date, required: true },
  startSubscription: [{ date: Date, sessionNumber: Number }],
  endSubscription: [{ date: Date }],
  currentSession: [{ date: Date, trainNumber: Number }]
});

// Create Client Model
const Client = mongoose.model("Client", clientSchema);

module.exports = { Client };
