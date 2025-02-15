const passport = require("passport");

exports.loginPage = async (req, res) => {
  res.render("login");
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("Inside passport.authenticate callback");
    console.log("Error:", err);
    console.log("User:", user);
    console.log("Info:", info);

    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }

    if (!user) {
      console.log("No user found/invalid credentials");
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      console.log("Login successful. Session:", req.session);
      console.log("User after login:", req.user);
      return res.redirect("/");
    });
  })(req, res, next);
};
