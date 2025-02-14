const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../controllers/homeController");
const authenticate = require("../middlewares/authenticate");
const fileRouter = require("./fileRouter");
const folderRouter = require("./folderRouter");
const fileController = require("../controllers/fileController");

homeRouter.get("/", authenticate.isAuthenticated, homeController.homePage);
homeRouter.get("/logout", homeController.logout);
homeRouter.use("/upload", authenticate.isAuthenticated, fileRouter);
homeRouter.get("/create_folder", homeController.getFolderForm);
homeRouter.post("/create_folder", homeController.createFolder);
homeRouter.use("/folder", authenticate.isAuthenticated, folderRouter);
homeRouter.post("/delete/:file_id", fileController.deleteFile);

module.exports = homeRouter;
