const { Schema, model } = require("mongoose")

const wonUsersDB = new Schema({
    username: {
        type: String,
        required:true
    },
    wonAmount: {
        type: Number,
        required:true
    }
})

module.exports =model("wonUsersDB", wonUsersDB )