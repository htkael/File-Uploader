const passport = require("passport");

exports.loginPage = async (req, res) => {
  res.render("login");
};

exports.login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true,
});
