const express = require("express");
const router = express.Router();
const Profile = require("../models/profile")

router.post("/profile", (req, res) => {
    new Profile(req.body)
        .save()
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/profile/s/:id", (req, res) => {
    const accountId = req.params.id;
    Profile.findOne({ accountId })
        .select({})
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Profile not found" })
            return res.status(200).json(value);
        })
        .catch(err => res.status(400).json(err));
});

router.get("/profile/filter", (req, res) => {
    const { role } = req.query;
    Profile.find({ role })
        .select({ __v: 0, _id: 0 })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/profile/all", (req, res) => {
    Profile.find({})
        .select({ __v: 0, _id: 0, position: 0, companyName: 0 })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.put("/profile", (req, res) => {

    const { accountId, role, name, address, companyName, position, contactNumber } = req.body;
    if (role === undefined) return res
        .status(400)
        .json({ message: "role is required" })

    let update;
    if (role === "client") update = { address, contactNumber, name, companyName }
    if (role === "staff") update = { address, contactNumber, name, position }
    if (role === "driver") update = { address, contactNumber, name }
    if (role === "owner") update = { address, contactNumber, name }

    Profile.findOneAndUpdate({ accountId }, update, { new: true })
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Profile not found" })
            return res.status(200).json(value);
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;