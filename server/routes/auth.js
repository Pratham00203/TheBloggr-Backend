const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const md5 = require("md5");
const db = require("../db/db");
const auth = require("../middleware/auth");

// @route POST /auth/register
// @description Register a user
// @access Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a Valid Email Id").isEmail(),
    check("password", "Enter a Password with 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // If the errors array is not empty set status 400:Bad request and give the error messages in json
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Get the details of the user
    let { name, email, password, bio, profile_img } = req.body;

    if (!profile_img)
      profile_img =
        "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png";

    try {
      let user = await db.query("SELECT * FROM USERS WHERE email=$1", [email]);
      if (user.rows.length != 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      let newPassword = md5(password);
      let result = await db.query(
        "INSERT INTO USERS (name,email,password,bio,profile_img) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [name, email, newPassword, bio, profile_img]
      );

      if (result.rows.length != 0) {
        const payload = { userid: result.rows[0].userid };

        const accessToken = jwt.sign(payload, process.env.JWT_TOKEN);

        res.status(201).json(accessToken);
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET /auth/login
// @description Test Route if User has already has a Token
// @access Public
router.get("/login", auth, async (req, res) => {
  try {
    let userid = req.user.userid;
    let user = await db.query("SELECT * FROM USERS WHERE userid=$1", [userid]);
    if (user.rows.length != 0) {
      return res.json({ user: user.rows[0] });
    }
  } catch (err) {
    return res.status.json({ msg: "Server Error" });
  }
});

// @route GET /auth/login
// @description Login User
// @access Public
router.post(
  "/login",
  [
    check("email", "Enter a Valid Email Id").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    // Errors array
    const errors = validationResult(req);
    // If the errors array is not empty set status 400:Bad request and give the error messages in json
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the details of the user
    const { email, password } = req.body;

    try {
      let user = await db.query("SELECT * FROM USERS WHERE email=$1", [email]);
      if (user.rows.length === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      let found;
      let newPassword = md5(password);

      if (user.rows[0].password === newPassword) {
        found = true;
      } else {
        found = false;
      }

      if (!found) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = { userid: user.rows[0].userid };

      const accessToken = jwt.sign(payload, process.env.JWT_TOKEN);

      res.status(201).json(accessToken);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route POST /auth/check-email
// @description Check if user exists by email
// @access Public
router.post(
  "/check-email",
  [check("email", "Enter a Valid Email Id").isEmail()],
  async (req, res) => {
    // Errors array
    const errors = validationResult(req);
    // If the errors array is not empty set status 400:Bad request and give the error messages in json
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      let check = await db.query("SELECT * FROM USERS WHERE email=$1", [email]);
      if (check.rows.length === 0) {
        res.status(400).json({ errors: [{ msg: "User doesn't exists" }] });
      } else {
        res.json("User found");
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
