const sqlite3 = require("sqlite3").verbose();
const databasePath = "./db/gym-app.db";
const titleBase = " | GYM App";
// Change password admin
function changePasswordAdmin(req, res) {
  // open the database
  let db = openDatabase();

  // update database
  const sqlChangePassword = `UPDATE 
                  admin
              SET 
                  userName = '${req.body.userName}',
                  password = '${req.body.password}' 
              WHERE 
                  adminId = 1 AND
                  password = '${req.body.oldPassword}'`;

  const checkOldPassword = `
    SELECT password FROM admin where adminId = 1
  `;

  let oldPassword;

  db.serialize(() => {
    // get old password
    db.get(checkOldPassword, [], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.send("Error old pass wrong!!");
      }
      oldPassword = row.password;
    })
      // change admin password
      .run(sqlChangePassword, function(err) {
        if (err) {
          console.error(err.message);
          return res.send("Faild!!");
        }
        console.log(oldPassword, req.body.oldPassword);

        if (oldPassword == req.body.oldPassword) {
          console.log("True");
          return res.send("Success@");
        }
        return res.send("Old Password Wrong");
      });
  });

  //close database
  closeDatabase(db);
}

// Register new member
function registerNewMember(req, res) {
  //open the database
  let db = openDatabase();
  let id = +req.body.clientId;

  // update database
  const sql = `
                INSERT INTO
                    client(clientId, firstName, lastName, startMemberDate, endMemberDate)
                VALUES(${id},'${req.body.firstName}','${req.body.lastName}',
                        '${req.body.startMemberDate}','${req.body.endMemberDate}')`;
  db.serialize(() => {
    db.run(sql, function(err) {
      console.log(req.body, typeof id, id);
      if (err) {
        console.error(err.message);
        return res.send("Faild!!");
      }
      res.send("registered");
    });
  });

  //close database
  closeDatabase(db);
}

// Edit exist member
function editMember(req, res) {
  //open the database
  let db = openDatabase();
  let id = +req.body.clientId;
  let newId = +req.body.newClientId;
  console.log(req.body);
  if (!newId) newId = id;
  // update database
  let sql = `UPDATE
                client
              SET
                clientId = ${newId},
                 firstName = '${req.body.firstName}',
                  lastName = '${req.body.lastName}',
                  startMemberDate = '${req.body.startMemberDate}',
                  endMemberDate = '${req.body.endMemberDate}'
              WHERE
                clientId= ${id}`;

  db.serialize(() => {
    db.run(sql, [], function(err) {
      if (err) {
        console.error(err.message);
        return res.send("Faild!!");
      }
      return res.send("Edited");
    });
  });

  //close database
  closeDatabase(db);
}

// Delete exist member
function deleteMember(req, res) {
  //open the database
  let db = openDatabase();

  // update database
  let sql = `DELETE FROM
                client
            WHERE
                clientId= 1`;

  db.serialize(() => {
    db.run(sql, err => {
      if (err) {
        console.error(err.message);
        return res.send("Faild!!");
      }
      return res.send("DELETED");
    });
  });

  //close database
  closeDatabase(db);
}

// Details member
function detailsMember(req, res) {
  //open the database
  let db = openDatabase();
  // let id = +req.body.clientId;
  let clientInfo;
  let endMonth;
  // update database
  let getClient = `SELECT 
                clientId,
                firstName,
                lastName,
                startMemberDate,
                endMemberDate
            FROM
                client
            WHERE
                clientId = 1`;

  let getStartMonth = `SELECT 
                          startMonth,
                          sessionsNumber
                      FROM
                          startSubscription
                      WHERE
                          startMonth 
                      BETWEEN 
                          '2020-07-01' AND '2020-07-31'`;
  let getEndMonth = `SELECT 
                          endMonth
                      FROM
                          endSubscription
                      WHERE
                          endMonth 
                      BETWEEN 
                          '2020-07-01' AND '2020-07-31'`;

  db.serialize(() => {
    db.get(getClient, [], (err, rows) => {
      if (err) {
        return res.send("Error details01");
      }
      console.log(rows);
      clientInfo = rows;
    })
      .get(getEndMonth, [], (err, rows) => {
        if (err) {
          return res.send("Error details02");
        }
        console.log(rows);
        endMonth = rows;
      })
      .all(getStartMonth, [], (err, rows) => {
        if (err) {
          return res.send("Error details03");
        }
        console.log(rows);
        return res.render("details-member", {
          title: `details-member ${titleBase}`,
          details: clientInfo,
          subscribe: rows,
          endMonth: endMonth
        });
      });
  });

  //close database
  closeDatabase(db);
}

// History member
function historyMember(req, res) {
  //open the database
  let db = openDatabase();
  // let id = +req.body.clientId;
  let clientInfo;
  let endMonth;
  // update database
  let getClient = `SELECT 
                clientId,
                firstName,
                lastName,
                startMemberDate,
                endMemberDate
            FROM
                client
            WHERE
                clientId = 1`;

  let getStartMonth = `SELECT 
                          startMonth,
                          sessionsNumber
                      FROM
                          startSubscription`;
  let getEndMonth = `SELECT 
                          endMonth
                      FROM
                          endSubscription`;

  db.serialize(() => {
    db.get(getClient, [], (err, rows) => {
      if (err) {
        return res.send("Error details01");
      }
      console.log(rows);
      clientInfo = rows;
    })
      .get(getEndMonth, [], (err, rows) => {
        if (err) {
          return res.send("Error details02");
        }
        console.log(rows);
        endMonth = rows;
      })
      .all(getStartMonth, [], (err, rows) => {
        if (err) {
          return res.send("Error details03");
        }
        console.log(rows);
        return res.render("history-member", {
          title: `history-member ${titleBase}`,
          details: clientInfo,
          subscribe: rows,
          endMonth: endMonth
        });
      });
  });

  //close database
  closeDatabase(db);
}

// Home Page
function homePage(req, res) {
  //open the database
  let db = openDatabase();

  let clientsInfo;
  // update database
  let getClients = `SELECT 
                      clientId,
                      firstName,
                      lastName
                    FROM
                        client`;

  let totalSession = `SELECT 
                          SUM(sessionsNumber) as totalSession
                      FROM
                          startSubscription
                      GROUP BY
                          clientId`;

  db.serialize(() => {
    db.all(getClients, [], (err, rows) => {
      if (err) {
        return res.send("Error details01");
      }
      console.log(rows);
      clientsInfo = rows;
    }).all(totalSession, [], (err, rows) => {
      if (err) {
        return res.send("Error details02");
      }
      console.log(rows);
      return res.render("home", {
        title: `Home ${titleBase}`,
        details: clientsInfo,
        totalSession: totalSession
      });
    });
  });

  //close database
  closeDatabase(db);
}

// open database
function openDatabase() {
  return new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Database connected.");
  }).run("PRAGMA foreign_keys = ON", err => {
    if (err) {
      console.error(err.message);
    }
  });
}

// close database
function closeDatabase(db) {
  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Closed database connection.");
  });
}

module.exports = {
  changePasswordAdmin,
  registerNewMember,
  editMember,
  deleteMember,
  detailsMember,
  historyMember,
  homePage
};

function insertMulti() {
  let db = openDatabase();

  // update database
  let sql;
  for (let i = 100; i < 200; i++) {
    sql = `
    INSERT INTO
        client(clientId, firstName, lastName, startMemberDate, endMemberDate)
    VALUES(${i}, ${"Ahmed " + i}, ${"Eid " + i},
            ${"2020-11-05"}, ${"2020-12-31"})`;

    db.serialize(() => {
      db.run(sql, function(err) {
        if (err) {
          console.error(err.message);
        } else console.error("Created 100 success");
      });
    });
  }

  //close database
  closeDatabase(db);
}

insertMulti();
