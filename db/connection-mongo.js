const mongoose = require("mongoose");

// connecting to db
const connection = mongoose
  .connect("mongodb://localhost/GymAppDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected DB");
  })
  .catch(err => {
    console.log(err.message);
  });

module.exports = connection;
