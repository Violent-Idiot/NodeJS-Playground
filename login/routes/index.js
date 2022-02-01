var express = require("express");
const bcrypt = require("bcrypt");
var mysql = require("mysql");
var passport = require("passport");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "mailer",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("SQL connected");
});

var router = express.Router();
/* GET home page. */
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/register", function (req, res, next) {
  res.render("register");
});
router.post("/register", (req, res) => {
  const emailid = req.body.email;
  const pass = req.body.password;
  let error = [];
  if (!emailid || !pass) {
    error.push({ msg: "Please fill the columns" });
  }
  if (error.length > 0) {
    res.render("register", {
      error,
    });
  } else {
    //hashing
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(pass, salt, (err, hash) => {
        if (err) throw err;
        console.log(hash);
        var sql = `INSERT INTO login(email, password) VALUES ('${emailid}','${hash}')`;
        db.query(sql, (err) => {
          if (err) throw err;
        });
      });
    });
  }

  res.redirect("/login");
});
router.get("/", function (req, res, next) {
  res.send("Welcome");
});

module.exports = router;
