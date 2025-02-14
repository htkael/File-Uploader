const { Router } = require("express");
const indexRouter = Router();
const loginRouter = require("./loginRouter");
const homeRouter = require("./homeRouter");
const registerRouter = require("./registerRouter");

indexRouter.use("/", homeRouter);
indexRouter.use("/login", loginRouter);
indexRouter.use("/register", registerRouter);

module.exports = indexRouter;
