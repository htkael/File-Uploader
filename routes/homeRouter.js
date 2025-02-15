const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../controllers/homeController");
const authenticate = require("../middlewares/authenticate");
const fileRouter = require("./fileRouter");
const folderRouter = require("./folderRouter");
const fileController = require("../controllers/fileController");
const folderController = require("../controllers/folderController");

homeRouter.get("/", authenticate.isAuthenticated, homeController.homePage);
homeRouter.get("/logout", homeController.logout);
homeRouter.use("/upload", authenticate.isAuthenticated, fileRouter);
homeRouter.get("/create_folder", homeController.getFolderForm);
homeRouter.post("/create_folder", homeController.createFolder);
homeRouter.use("/folder", authenticate.isAuthenticated, folderRouter);
homeRouter.post("/delete/file/:file_id", fileController.deleteFile);
homeRouter.post("/delete/folder/:folder_id", folderController.deleteFolder);
homeRouter.get("/details/:file_id", fileController.getFileDetails);
homeRouter.get("/download/:file_id", fileController.downloadFile);

module.exports = homeRouter;
