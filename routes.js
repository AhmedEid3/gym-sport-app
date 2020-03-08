const mongoose = require("mongoose");
const { connection } = require("./db/connection-mongo");
const querystring = require("querystring");

const { Client } = require("./model/client");
const {
  valuesOfSpecificMonth,
  sortByDay,
  findFirstDayOfMonth,
  findLastDayOfMonth,
  sumOfObj,
  sheckStatus
} = require("./helpers/generic");

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

        if (oldPassword == req.body.oldPassword) {
          return res.send("Success@");
        }
        return res.send("Old Password Wrong");
      });
  });

  //close database
  closeDatabase(db);
}

// Home Page
async function homePage(req, res) {
  try {
    const clients = await Client.find().select({
      clientId: 1,
      firstName: 1,
      lastName: 1
    });

    if (!clients) {
      return res.render("error", {
        errorMSG: "Faild Get Home page!! cant fined client\n" + error.message
      });
    }

    return res.render("home", {
      title: `Home ${titleBase}`,
      clientsInfo: clients,
      message: req.query.msg || ""
    });
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

// Register new member
async function registerNewMember(req, res) {
  try {
    // create new course instance
    const client = new Client({
      clientId: +req.body.clientId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      membershipStartingDate: req.body.membershipStartingDate,
      membershipExpiryDate: req.body.membershipExpiryDate
    });

    const result = await client.save();
    const query = querystring.stringify({
      msg: "Successfully Registered."
    });
    res.redirect(`/details-member/${+req.body.clientId}?${query}`);
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

// Get Edit Exist member
async function getEditMember(req, res) {
  try {
    const id = +req.params.clientId;
    const client = await Client.findOne({ clientId: id }).select({
      clientId: 1,
      firstName: 1,
      lastName: 1,
      membershipStartingDate: 1,
      membershipExpiryDate: 1
    });

    if (!client) {
      return res.render("error", {
        errorMSG: "Cant Find a Member With This ID"
      });
    }
    res.render("edit-member", {
      title: `edit-member Page ${titleBase}`,
      clientInfo: client
    });
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

// Edit exist member
async function editMember(req, res) {
  try {
    const id = +req.body.clientId;

    let newId = +req.body.newClientId;
    if (!newId) newId = id;
    const client = await Client.findOne({ clientId: id });
    if (!client) {
      return res.render("error", {
        errorMSG: "Can't Find a Member With This ID"
      });
    }

    client.set({
      clientId: newId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      membershipStartingDate: req.body.membershipStartingDate,
      membershipExpiryDate: req.body.membershipExpiryDate
    });
    const result = await client.save();

    const query = querystring.stringify({
      msg: "Successfully Modified..."
    });
    res.redirect(`/details-member/${newId}?${query}`);
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

// Details member
async function detailsMember(req, res) {
  try {
    const id = +req.params.clientId;
    const client = await Client.findOne({
      clientId: id
    }).select({
      clientId: 1,
      firstName: 1,
      lastName: 1,
      membershipStartingDate: 1,
      membershipExpiryDate: 1,
      startSubscription: 1,
      endSubscription: 1,
      currentSession: 1
    });

    if (!client) {
      return res.render("error", {
        errorMSG: "Can't Find a Member With This ID"
      });
    }

    let details = {
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      membershipStartingDate: client.membershipStartingDate,
      membershipExpiryDate: client.membershipExpiryDate,
      startSubscriptionMonthly: null,
      endSubscriptionMonthly: null,
      totalSessions: null,
      currentSession: null,
      restSession: null,
      statusMonthly: null,
      statusMembership: null,
      currentSessionArr: null
    };

    // get start Month
    const currentDate = new Date();
    let valuesStartMonth = [];
    if (client.startSubscription.length) {
      valuesStartMonth = valuesOfSpecificMonth(
        client.startSubscription,
        currentDate
      );
      let sortedMonth = sortByDay(valuesStartMonth);
      let firstDayMonth = findFirstDayOfMonth(sortedMonth, currentDate);
      if (firstDayMonth) details.startSubscriptionMonthly = firstDayMonth.date;

      // get End Month
      if (client.endSubscription.length) {
        let valuesEndMonth = valuesOfSpecificMonth(
          client.endSubscription,
          currentDate
        );
        let sortedEndMonths = sortByDay(valuesEndMonth);
        let lastDayMonth = findLastDayOfMonth(sortedEndMonths, currentDate);
        if (lastDayMonth) {
          details.endSubscriptionMonthly = lastDayMonth.date;
          // check Status Monthly
          details.statusMonthly = sheckStatus(lastDayMonth.date, currentDate);
        }
      }
    }

    // Total Sessions
    let totalSessions;

    if (valuesStartMonth.length) {
      totalSessions = sumOfObj(valuesStartMonth, "sessionNumber");
      if (totalSessions) details.totalSessions = totalSessions;
    }

    // Current Session
    let currentSession;
    if (client.currentSession.length) {
      // Current Session Array
      let valuesSessionArr = valuesOfSpecificMonth(
        client.currentSession,
        currentDate
      );
      let sortedSessionArr = sortByDay(valuesSessionArr);
      details.currentSessionArr = sortedSessionArr;

      // Current Session number
      currentSession = sumOfObj(
        valuesOfSpecificMonth(client.currentSession, currentDate),
        "trainNumber"
      );

      if (currentSession) {
        details.currentSession = currentSession;
      } else if (currentSession == 0) {
        details.currentSession = 0;
      }
    } else {
      currentSession = 0;
      details.currentSession = currentSession;
    }

    // rest Session
    if (totalSessions >= 0 && currentSession >= 0) {
      details.restSession = totalSessions - currentSession;
    }

    // check Status Monthly
    details.statusMembership = sheckStatus(
      client.membershipExpiryDate,
      currentDate
    );

    res.render("details-member", {
      title: `details-member ${titleBase}`,
      details: details,
      message: req.query.msg || ""
    });
  } catch (error) {
    return res.render("error", {
      errorMSG: "Can't Find a Member With This ID"
    });
  }
}

// History member
async function historyMember(req, res) {
  try {
    const id = +req.params.clientId;
    const client = await Client.findOne({
      clientId: id
    }).select({
      clientId: 1,
      firstName: 1,
      lastName: 1,
      membershipExpiryDate: 1,
      startSubscription: 1,
      endSubscription: 1,
      currentSession: 1
    });

    let details = {
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      startSubscription: client.startSubscription,
      currentSession: client.currentSession,
      statusMonthly: null,
      statusMembership: null
    };

    // get End Month
    const currentDate = new Date();
    if (client.endSubscription.length) {
      let valuesEndMonth = valuesOfSpecificMonth(
        client.endSubscription,
        currentDate
      );
      let sortedEndMonths = sortByDay(valuesEndMonth);
      let lastDayMonth = findLastDayOfMonth(sortedEndMonths, currentDate);
      if (lastDayMonth) {
        // check Status Monthly
        details.statusMonthly = sheckStatus(lastDayMonth.date, currentDate);
      }
    }

    // check Status Membership
    details.statusMembership = sheckStatus(
      client.membershipExpiryDate,
      currentDate
    );

    if (!client) {
      return res.render("error", {
        errorMSG: "Can't Find a Member With This ID"
      });
    }

    return res.render("history-member", {
      title: `history-member ${titleBase}`,
      details: details
    });
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

// Add new session
async function newSession(req, res) {
  try {
    const id = +req.body.clientId;
    const addNewSession = +req.body.addNewSession;

    if (!id || !addNewSession) {
      return res.render("error", {
        errorMSG: "Faild provide session number"
      });
    }

    const client = await Client.findOne({ clientId: id });

    if (!client) {
      return res.render("error", {
        errorMSG: "Faild cant fined client"
      });
    }

    const currentDate = new Date();
    const newSession = {
      date: currentDate,
      sessionNumber: addNewSession
    };
    client.startSubscription.push(newSession);

    // add end month
    const lastMonth = {
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    };
    const currenEndMonth = lastMonth.date;

    const lastEndMonth =
      client.endSubscription[client.endSubscription.length - 1];

    if (!client.endSubscription.length) client.endSubscription.push(lastMonth);
    else if (currenEndMonth.toString() !== lastEndMonth.date.toString()) {
      client.endSubscription.push(lastMonth);
    }

    const result = await client.save();

    const query = querystring.stringify({
      msg: "Session added successfully..."
    });
    res.redirect(`/details-member/${id}?${query}`);
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

// Remaining Session
async function remainSession(req, res) {
  try {
    const id = +req.body.clientId;
    const trainNumber = +req.body.trainNumber;

    if (!id || !trainNumber) {
      return res.render("error", {
        errorMSG: error.message
      });
    }

    const client = await Client.findOne({ clientId: id });

    if (!client) {
      return res.render("error", {
        errorMSG: "Can't Find a Member With This ID"
      });
    }
    const currentDate = new Date();
    const newTrainNumber = {
      date: currentDate,
      trainNumber: trainNumber
    };

    client.currentSession.push(newTrainNumber);

    const result = await client.save();
    return res.send(currentDate);
  } catch (error) {
    return res.render("error", {
      errorMSG: "Faild Add Train Number!!" + error.message
    });
  }
}

// Delete exist member
async function deleteMember(req, res) {
  try {
    const id = +req.body.clientId;

    const client = await Client.findOneAndRemove({ clientId: id });
    if (!client) {
      return res.render("error", {
        errorMSG: "Faild Delete a Member!! \n" + error.message
      });
    }

    const query = querystring.stringify({
      msg: "Successfully Deleted Member..."
    });
    res.redirect(`/?${query}`);
  } catch (error) {
    return res.render("error", {
      errorMSG: error.message
    });
  }
}

module.exports = {
  changePasswordAdmin,
  registerNewMember,
  editMember,
  deleteMember,
  detailsMember,
  historyMember,
  homePage,
  getEditMember,
  newSession,
  remainSession
};
