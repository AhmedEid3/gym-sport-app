const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db/gym.sqlite"
  }
});

module.exports = knex;
