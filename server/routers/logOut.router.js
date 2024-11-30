const express = require("express")
const logOutRouter = express.Router()
const logOutController = require("../controllers/logOut.controller")


logOutRouter.get("/log-out", logOutController)

module.exports = logOutRouter