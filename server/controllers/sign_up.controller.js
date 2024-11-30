const usersDB = require("../models/users.model");
const bcrypt = require("bcrypt");
const { accessToken } = require("../jwt/jwt");

const sign_up_post = async (req, res) => {
  try {
    const { phone_number, username, password, referral_code } = req.body;

    /* Add a referral to the referral_code provided */
    if (referral_code?.length > 6) {
      return res.status(400).json({ message: "Invalid referral code length" });
    }

    if (referral_code) {
      const addReferral = async () => {
        try {
          // Find user with the referral code
          const referrer = await usersDB.findOne({ referral_code });
          if (!referrer) {
            return res.status(403).json({ message: "Invalid referral code" });
          }

          // Check referrals
          const referrals = referrer.referrals;

          // Update referrals
          if (referrals !== undefined) {
            const updatedReferral = referrals + 1;
            await usersDB.updateOne(
              { referral_code },
              { $set: { referrals: updatedReferral } },
              { upsert: true }
            );
          }
        } catch (e) {
          return res
            .status(403)
            .json({ message: "Error processing referral code" });
        }
      };
      await addReferral();
      if (res.headersSent) return; // Stop execution if a response was sent
    }

    /* Check length of fields */
    if (phone_number.length < 10 || username.length < 4 || password.length < 5) {
      console.log("Short input fields");
      return res.status(403).json({
        message: "One of the required sign-up fields is short in length",
      });
    }

    /* Check username in DB */
    try {
      const check_username_in_DB = await usersDB.findOne({ username });
      if (check_username_in_DB) {
        console.log("Username taken");
        return res.status(403).json({
          message: "Username already taken",
        });
      }
    } catch (e) {
      console.log("Error checking username in DB", e);
      return res.status(500).json({ message: "Internal server error" });
    }

    /* Check phone number in DB */
    try {
      const check_user_in_DB = await usersDB.findOne({ phone_number });
      if (check_user_in_DB) {
        console.log("User exists");
        return res.status(400).json({
          message: "User already exists",
        });
      }
    } catch (e) {
      console.log("Error checking phone number in DB", e);
      return res.status(500).json({ message: "Internal server error" });
    }

    console.log("User is good to go ---> SIGNUP-CONTROLLER");

    /* Hash password */
    let hashedPassword ;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (e) {
      console.log("Error hashing password", e);
      return res.status(500).json({ message: "Internal server error" });
    }

    /* Fetch latest user ID */
    let latest_user;
    try {
      latest_user = await usersDB.find({}).sort({ id: -1 }).limit(1);
    } catch (e) {
      console.log("Error fetching latest user ID", e);
      return res.status(500).json({ message: "Internal server error" });
    }

    /* Generate referral code */
    function generateRandomString() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 5; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }
    const generatedReferralCode = generateRandomString().toUpperCase();

    /* Add user to DB */
    try {
      const user = await usersDB.create({
        id: latest_user?.id || 0,
        username,
        balance: 0,
        phone_number,
        password:hashedPassword,
        referral_code: generatedReferralCode,
        referrals: 0,
      });
      return res
        .status(200)
        .send({ message: "Signed up successfully", ok: true });
    } catch (e) {
      console.log("Could not add user to DB", e);
      return res.status(400).json({ message: "Could not save user to DB"});
  } 
  }
  catch (e) {
    console.log("Sign up process failed", e);
    return res.status(400).json({ message: "Sign up failed. Try again" });
    }
};

module.exports = sign_up_post;
