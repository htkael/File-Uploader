require("dotenv").config();
const path = require("node:path");
const express = require("express");
const app = express();
const sessionConfig = require("./config/session");
const passportConfig = require("./config/passport");
const indexRouter = require("./routes/indexRouter");
const fileUpload = require("express-fileupload");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

console.log("Server start...");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

sessionConfig(app);
passportConfig(app);

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app listening on PORT ${PORT}`);
});
