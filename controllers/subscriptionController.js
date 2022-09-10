const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscriptions");

router.post("/subscription", async (req, res) => {
    new Subscription(req.body)
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
