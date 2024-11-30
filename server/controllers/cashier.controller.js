const usersDB = require("../models/users.model");

const cashierController = async (req, res) => {
    if (!req.username) {
        return res.status(403).send({ message: "Log in first" });
    }

    try {
        const username = req.username;
        const foundUser = await usersDB.findOne({ username });

        if (!foundUser) {
            return res.status(404).send({ message: "User not found" });
        }

        const { balance, referrals, phone_number, referral_code } = foundUser;
        const userDetails = {
            balance,
            username,
            referrals,
            phone_number,
            referral_code,
        };

        return res.status(200).send(userDetails);
    } catch (error) {
        console.error("Error in cashierController:", error);
        return res.status(500).send({ message: "An internal error occurred" });
    }
};

const withdrawController = async (req, res) => {
    if (!req.username) {
        return res.status(403).send({ message: "Log in first" });
    }

    try {
        const username = req.username;
        const amount = req.body?.amount;

        if (!amount) {
            return res.status(400).send({ message: "Amount is required" });
        }

        const userDetails = await usersDB.findOne({ username });

        if (!userDetails) {
            return res.status(404).send({ message: "User not found" });
        }

        let { balance } = userDetails;

        if (amount > balance) {
            return res.status(400).send({ message: "Insufficient balance" });
        }

        balance -= amount;

        await usersDB.findOneAndUpdate({ username }, { balance }, { upsert: true });

        return res.status(200).send({ message: "Withdrawal successful" });
    } catch (error) {
        console.error("Error in withdrawController:", error);
        return res.status(500).send({ message: "An internal error occurred" });
    }
};

const bonusController = (req, res) => {
    // Placeholder for future implementation
    return res.status(501).send({ message: "Bonus functionality not implemented" });
};

module.exports = { cashierController, withdrawController, bonusController };
