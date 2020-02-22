const {
  changePasswordAdmin,
  registerNewMember,
  editMember,
  deleteMember,
  detailsMember,
  historyMember,
  homePage
} = require("./model");
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
app.get("/edit-member/:id", (req, res) => {
  res.render("edit-member", {
    title: `edit-member Page ${titleBase}`
  });
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

// History member
app.get("/history-member/:clientId", (req, res) => {
  historyMember(req, res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
