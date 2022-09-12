const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user")

router.post("/register", async (req, res) => {
    const { email, password, role } = req.body;

    if (email === undefined || password === undefined) return res
        .status(400)
        .send({ message: "Invalid Registration Properties" });

    const user = await User.findOne({ email });
    console.log(user)
    if (user) return res
        .status(400)
        .send({ message: "Email is currently used" });


    await bcrypt.hash(password, 12)
        .then(async (hashValue) => {
            new User({ email, hashValue, role })
                .save()
                .then((value) => {
                    const accessToken = jwt.sign(
                        { data: value._id.toString() },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "2h" }
                    );
                    res.status(200).json({
                        accountId: value._id,
                        email,
                        password: hashValue,
                        token: accessToken,
                    })
                })
                .catch((err) => res.status(400).send(err));
        });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) return res
        .status(400)
        .send({ message: "Invalid Login Properties" });

    const user = await User.findOne({ email });
    if (!user) return res
        .status(400)
        .json({ message: "Account doesn't exist" });

    await bcrypt.compare(password, user.hashValue)
        .then((value) => {
            if (value == false) return res
                .status(400)
                .json({ message: "Invalid login" });

            const accessToken = jwt.sign(
                { data: user._id.toString() },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "2h" }
            );
            return res.status(200).json({
                accountId: user._id,
                email: user.email,
                password: user.hashValue,
                token: accessToken,
            });
        });
});

module.exports = router;
