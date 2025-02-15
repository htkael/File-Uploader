const prisma = require("../prisma/client");
const validators = require("../middlewares/validators");
const { validationResult } = require("express-validator");
const registerValidation = validators.registerValidation;
const bcrypt = require("bcryptjs");

exports.getRegisterForm = async (req, res) => {
  res.render("register");
};

exports.register = [
  registerValidation,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("register", {
          errors: errors.array(),
          formData: req.body,
        });
      }
      const username = req.body.username;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    } catch (err) {
      console.error("Could not add user", err);
      next(err);
    }
  },
];
