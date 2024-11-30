const express = require("express");
const sign_in_router = express.Router();
const { accessToken } = require("../jwt/jwt");
const usersDB = require("../models/users.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");

sign_in_router.post("/login", async (req, res) => {
  try {
    const loginSchema = Joi.object({
      phone_number: Joi.number().required(),
      password: Joi.string().min(5).required(),
    });

    // Validate user input using Joi
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(403).send({ message: "Invalid username/password" });
    }

    const { phone_number, password } = value;

    // Check if user exists in DB
    let foundUser;
    try {
      foundUser = await usersDB.findOne({ phone_number });
    } catch (err) {
      console.log("Error querying database:", err);
      return res.status(500).send({ message: "An error occured. Try again" });
    }

    // If no user is found
    if (!foundUser) {
      return res.status(403).send({ message: "Wrong number or password" });
    }

    // Check password match
    try {
      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordMatch) {
        return res.status(403).send({ message: "Wrong number or password" });
      }

      // Password matches; set access token cookie
      const { username } = foundUser;
      res.cookie("access", accessToken(foundUser), {
        httpOnly: true,
        maxAge: 79 * 60 * 1000, // 79 minutes
        sameSite: "lax",
      });

      return res.status(200).redirect("/");
    } catch (err) {
      console.log("Error comparing passwords:", err);
      return res.status(500).send({ message: "An error occured. Try again" });
    }
  } catch (err) {
    console.log("Unexpected error during login:", err);
    if (!res.headersSent) {
      return res.status(500).send({ message: " Unexpected error during login:" });
    }
  }
});

module.exports = sign_in_router;
