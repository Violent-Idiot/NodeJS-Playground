var localStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "mailer",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("SQL login connected");
});
module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.query("select * from login where id = " + id, function (err, rows) {
      done(err, rows[0]);
    });
  });
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      let sql = `select * from login where email = '${email}'`;
      db.query(sql, (err, result) => {
        console.log(result);
        if (err) throw err;
        if (!result.length) {
          console.log("error");
          return done(null, false, { message: "credentials invalid" });
        }

        bcrypt.compare(password, result[0].password, (err, match) => {
          if (err) throw err;
          if (match) {
            return done(null, result[0]);
          } else {
            return done(null, false, { message: "credentials invalid" });
          }
        });
      });
    })
  );
};
