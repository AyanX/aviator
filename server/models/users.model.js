const {Schema ,model} = require("mongoose")


const users = new Schema({
    id: {
        type: Number,
        required:true
    },
    username: {
        type: String,
        required:true
    },
    balance: {
        type: Number,
        required:true
    },
   phone_number: {
        type: Number,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    jwt: {
        type: String,
    },
    referral_code:String,
    referrals:{
        default:0,
        type:Number,
    }
    
})
module.exports = model("user" , users)