const express = require("express")

const sign_up_router = express.Router()

const sign_up_post= require("../controllers/sign_up.controller")


sign_up_router.post("/sign-up", sign_up_post)

module.exports = sign_up_router