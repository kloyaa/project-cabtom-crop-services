const express = require("express");
const router = express.Router();
const Message = require("../models/messages");

router.post("/message", async (req, res) => {
    new Message(req.body)
        .save()
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/message/all", async (req, res) => {
    Message.find({})
        .select({ __v: 0, })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.put("/message", async (req, res) => {
    const { _id, opened } = req.body;
    const update = { $set: { opened } };

    Message.findByIdAndUpdate(_id, update, { new: true })
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Message not found" })
            return res.status(200).json(value);
        })
        .catch(err => res.status(400).json(err));
});

router.delete("/message/:id", async (req, res) => {
    const _id = req.params.id;
    Message.findByIdAndDelete(_id)
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Message not found" })
            return res.status(200).json({ message: "Message deleted" });
        })
        .catch(err => res.status(400).json(err));
});


module.exports = router;
