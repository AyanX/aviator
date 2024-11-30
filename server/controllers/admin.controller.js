const usersDB = require("../models/users.model");

const adminGetController = async (req, res) => {
    try {
        const users = await usersDB.find({});
        const totalUsers = users.length;
        const userNames = users.map(user => user.username);

        return res.send({ totalUsers, userNames });
    } catch (error) {
        console.error("Error fetching users:", error);
        if (!res.headersSent) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

const adminPostController = async (req, res) => {
    const { phone_number, password } = req.body;

    try {
        console.log("Admin logging in");
        console.log(phone_number, password);

        if (!(phone_number && password)) {
            if (!res.headersSent) {
                return res.status(403).send({ message: "Phone number and password are required" });
            }
        }

        if (!(phone_number === "0758954624" && password === "Xhadyy123.")) {
            if (!res.headersSent) {
                return res.status(403).send({ message: "Invalid credentials" });
            }
        }

        console.log("Admin success log in");
        if (!res.headersSent) {
            return res.status(200).send({ message: "Success" });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        if (!res.headersSent) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

module.exports = { adminGetController, adminPostController };
