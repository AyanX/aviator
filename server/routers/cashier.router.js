const express = require("express")
const cashierRouter = express.Router()

const {cashierController,withdrawController,bonusController} = require("../controllers/cashier.controller") 

cashierRouter.get("/",cashierController)
cashierRouter.post("/withdraw",withdrawController)
cashierRouter.post("/deposit",async (req,res)=> {
    setTimeout(()=> { 
        console.log("depositing")
        res.send({message:"an err occured"})
    },2000)
    return
})

module.exports = cashierRouter