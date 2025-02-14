const { Router } = require("express");
const registerRouter = Router();
const registerController = require("../controllers/registerController");

registerRouter.get("/", registerController.getRegisterForm);
registerRouter.post("/", registerController.register);

module.exports = registerRouter;
