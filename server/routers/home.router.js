const express = require("express")
const {getHomePage} = require("../controllers/homepage.controller")
const { verifyHomeToken,verifyToken } = require("../jwt/jwt")



const homeRouter = express.Router()
homeRouter.get("/", verifyHomeToken, getHomePage)
module.exports = homeRouter