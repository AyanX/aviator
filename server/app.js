const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sign_up_router = require("./routers/sign_up.router")
const app = express();
const helmet = require("helmet")
const sign_in_router = require("./routers/sign_in.router")
const get_players = require("./routers/players_router");
const homeRouter = require("./routers/home.router");
const logOutRouter = require("./routers/logOut.router")
const {verifyToken} = require("./jwt/jwt")
const cashierRouter = require("./routers/cashier.router")
const adminRouter = require("./routers/admin.router")
const xss = require('xss-clean');

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});


app.use(limiter);
app.use(xss());
app.use(
  cors({
    credentials:true,
    origin:[ "http://localhost:3000", "http://localhost:3001"],
    
  })
);
app.use(express.urlencoded({extended:true}))
app.use(helmet())
app.use(express.json());
app.use(cookieParser());

app.use(homeRouter)
app.use(sign_up_router)
app.use(sign_in_router)
app.use(get_players)
app.use(logOutRouter)
app.use(adminRouter)

app.use("/cashier",verifyToken,cashierRouter)


module.exports = app;
