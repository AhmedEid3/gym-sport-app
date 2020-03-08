const {
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
} = require("./routes");
const express = require("express");
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");

const titleBase = " | GYM App";

// Get Home Page
app.get("/", (req, res) => {
  homePage(req, res);
});

// Get and Change password admin
app.get("/admin", (req, res) => {
  res.render("admin", { title: `admin Page ${titleBase}` });
});
app.post("/admin", (req, res) => {
  changePasswordAdmin(req, res);
});

// register new member
app.get("/register-member", (req, res) => {
  res.render("register-member", { title: `register-member Page ${titleBase}` });
});
app.post("/register-member", (req, res) => {
  registerNewMember(req, res);
});

// Edit member
app.get("/edit-member/:clientId", (req, res) => {
  getEditMember(req, res);
});
app.post("/edit-member/", (req, res) => {
  editMember(req, res);
});

// Delete member
app.post("/delete-member", (req, res) => {
  deleteMember(req, res);
});

// Details member
app.get("/details-member/:clientId", (req, res) => {
  detailsMember(req, res);
});

// add newSession
app.post("/new-session/", (req, res) => {
  newSession(req, res);
});

// Remaining Session
app.post("/remain-session/", (req, res) => {
  remainSession(req, res);
});

// History member
app.get("/history-member/:clientId", (req, res) => {
  historyMember(req, res);
});

app.listen(port, () => console.log(`GYM app listening on port ${port}!`));
const moment = require("moment-timezone");
let dd = moment(new Date())
  .format()
  .valueOf();
console.log(dd);
console.log(new Date(dd));
