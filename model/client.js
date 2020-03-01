const mongoose = require("mongoose");

// // Start Subscription Schema
// const startSubscriptionSchema = new mongoose.Schema({
//   startSubscription: { startMonth: Date, sessionNumber: Number }
// });
// // Create StartSubscription Model
// const StartSubscription = mongoose.model(
//   "StartSubscription",
//   startSubscriptionSchema
// );

// End Subscription Schema
// const endSubscriptionSchema = new mongoose.Schema({
//   endSubscription: Date
// });
// Create EndSubscription Model
// const EndSubscription = mongoose.model(
//   "EndSubscription",
//   endSubscriptionSchema
// );

// Current Session Schema
// const currentSessionSchema = new mongoose.Schema({
//   currentSession: { currentDate: Date, trainNumber: Number }
// });
// Create currentSessionSchema Model
// const CurrentSession = mongoose.model("CurrentSession", currentSessionSchema);

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

// const clientSchema = new mongoose.Schema({
//   clientId: { type: Number, required: true, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   membershipStartingDate: { type: Date, required: true },
//   membershipExpiryDate: { type: Date, required: true },
//   monthlySubscription: [{ startMonth: Date, endMonth: Date }],
//   addSessions: [{ dateSession: Date, numberSession }],
//   currentSession: [{ currentDate: Date, trainNumber: Number }]
// });
// Create Client Model
const Client = mongoose.model("Client", clientSchema);

module.exports = { Client };
