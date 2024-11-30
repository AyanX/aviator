const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const accessToken = (foundUser) => {
  const { username, phone_number } = foundUser;
  const signAccessToken = sign(
    { username, phone_number },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: "80m" }
  );
  return signAccessToken;
};
const verifyToken = (req, res, next) => {
  const tokenCookie = req.headers.cookie;
  if (!tokenCookie) {
    return res.status(403).send({ message: "Log in first" });
  }

  try {
    const cookie = tokenCookie.split("=")[1];
    verify(cookie, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(404).send({ message: " invalid token" });
      }
      req.username = decoded.username;
      console.log("cookie check passed");
      return next();
    });
  } catch (e) {
    return res
      .status(404)
      .send({ message: "an error occured validating the access token" });
  }
};
const verifySocketToken = (tokenCookie) => {
  const cookie = tokenCookie.split("=")[1];
  if (!cookie) {
    return;
  }
  const user = verify(cookie, process.env.ACCESS_TOKEN_KEY)
  if(!user){return}
  return user.username
};
const verifyHomeToken = (req, res, next) => {
  const tokenCookie = req.headers.cookie;
  if (!tokenCookie) {
    return next();
  }
  const cookie = tokenCookie.split("=")[1];
  verify(cookie, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" });
    }
    req.username = decoded.username;
    return next();
  });
  return;
};

module.exports = {
  verifySocketToken,
  accessToken,
  verifyToken,
  verifyHomeToken,
};
