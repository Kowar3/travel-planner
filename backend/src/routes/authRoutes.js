const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter valid email address!"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must contain min 8 characters!")
      .matches(/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/)
      .withMessage(
        "Password must contain letter, number and special character!",
      ),
    body("firstName").notEmpty().withMessage("First name is mandatory field!"),
    body("lastName").notEmpty().withMessage("Last name is mandatory field!"),
  ],
  authController.register,
);

router.post("/login", authController.login);

module.exports = router;
