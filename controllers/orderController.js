const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product")
const productId = process.env.DEFAULT_ID;

router.post("/order", async (req, res) => {

    const product = await Product.findOne({ productId });
    const payload = {
        "header": req.body.header,
        "order": { product: Object.entries(product._doc) }
    }
    new Order(payload)
        .save()
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/order/client/:id", async (req, res) => {
    const accountId = req.params.id;
    Order.find({ "header.clientId": accountId })
        .select({ __v: 0, _id: 0 })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/order/staff/:id", async (req, res) => {
    const accountId = req.params.id;
    Order.find({ "header.staffId": accountId })
        .select({ __v: 0, _id: 0 })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/order/driver/:id", async (req, res) => {
    const accountId = req.params.id;
    Order.find({ "header.driverId": accountId })
        .select({ __v: 0, _id: 0 })
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/order/all", async (req, res) => {
    const { status, deliveryStatus } = req.query;

    if (status !== undefined)
        return Order.find({ "order.status": status })
            .select({ __v: 0, _id: 0 })
            .then(value => res.status(200).json(value))
            .catch(err => res.status(400).json(err));

    if (deliveryStatus !== undefined)
        return Order.find({ "order.deliveryStatus": deliveryStatus, "order.status": "available" })
            .select({ __v: 0, _id: 0 })
            .then(value => res.status(200).json(value))
            .catch(err => res.status(400).json(err));


    return res.status(400).json({ message: "Query format is invalid" });
});

router.put("/order", (req, res) => {
    const { role, orderId, status, accountId, deliveryStatus } = req.body;
    let update;

    if (role == "staff") {
        if (status === undefined) return res
            .status(200)
            .json({ message: "status is required" });

        update = {
            $set: { "header.staffId": accountId, "order.status": status }
        }

    }
    if (role == "driver") {

        if (deliveryStatus === undefined) return res
            .status(200)
            .json({ message: "deliveryStatus is required" });

        update = {
            $set: { "header.driverId": accountId, "order.deliveryStatus": deliveryStatus }
        }
        if (deliveryStatus === "delivered") {

        }

    }
    Order.findOneAndUpdate({ orderId }, update, { new: true })
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Order not found" })
            return res.status(200).json(value);
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;