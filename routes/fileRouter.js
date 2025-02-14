const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileController");

fileRouter.get("/", fileController.getUploadForm);
fileRouter.post("/", fileController.uploadFile);

module.exports = fileRouter;
