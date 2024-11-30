const usersDB = require("../models/users.model");
const getHomePage = async (req, res) => {

  if (!req.username) {
   return res.send({ username: null, phone_number: null, balance: null });
  }
  
  try {
    //find user in db via req.username from middleware
    const userDetails = await usersDB.findOne({ username: req.username });
    //extract user details
    const { username, phone_number, balance } = userDetails;
    return res.status(200).send({
      username,
      phone_number,
      balance,
    });
  } catch (e) {
   return res.status(400).send({ message: "Wrong access token" });
  }
};

module.exports = {getHomePage};
