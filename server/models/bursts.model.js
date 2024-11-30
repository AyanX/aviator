const { Schema, model } = require("mongoose")

const burstsDB = new Schema({
    bursts:[Number]
})

module.exports = model("burstsDB", burstsDB)