const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const sessionConfig = (app) => {
  app.use(
    session({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax", // Add this
      },
      proxy: true, // Add this
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    })
  );
};

module.exports = sessionConfig;
