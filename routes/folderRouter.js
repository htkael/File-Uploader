const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController");
const homeController = require("../controllers/homeController");
const fileController = require("../controllers/fileController");

folderRouter.get("/:folder_id", folderController.folder);
folderRouter.get("/:folder_id/create", folderController.getCreateForm);
folderRouter.post("/:folder_id/create", homeController.createFolder);
folderRouter.post("/:folder_id/upload", fileController.uploadFile);

module.exports = folderRouter;
