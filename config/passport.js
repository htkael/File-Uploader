const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");

const passportConfig = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Login attempt for username:", username);
        const user = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });

        console.log("User found:", !!user);

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        console.log("Password match:", match);

        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        console.error("Strategy error:", err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = passportConfig;
