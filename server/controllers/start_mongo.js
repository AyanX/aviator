const mongoose = require("mongoose");
require("dotenv").config();

async function startDB() {
  mongoose.connection.once("open", async () => {
    console.log("DB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log(`MONGOOSE error occured : ${err}`);
  });

  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (e) {
    console.log("No MONGOOSE CONNECTION AND SERVER");
  }
}
module.exports = startDB;
