const express = require("express")
const adminRouter = express.Router()

const {adminGetController, adminPostController} = require("../controllers/admin.controller")

adminRouter.get("/admin" , adminGetController)
adminRouter.post("/admin" , adminPostController)

module.exports = adminRouter