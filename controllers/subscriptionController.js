const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscriptions");

router.post("/subscription", async (req, res) => {
    const email = await Subscription.findOne({ email: req.body.email });
    if (email) return res.status(400).json({ message: "Email existed" });

    return new Subscription(req.body)
        .save()
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/subscription/all", async (req, res) => {
    Subscription.find({})
        .select({ __v: 0, })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
