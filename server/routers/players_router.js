const getPlayers = require("../controllers/getPlayers.controller")


const express  = require("express")
const players_router = express.Router()

players_router.get("/players", getPlayers)

module.exports = players_router