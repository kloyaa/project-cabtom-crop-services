const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/product")
const Profile = require("../models/profile")

const productId = process.env.DEFAULT_ID;
const { v4: uuidv4 } = require("uuid");

router.post("/order", async (req, res) => {

    const product = await Product.findOne({ productId });
    const payload = {
        "header": req.body.header,
        "orderId": uuidv4(),
        "order": {
            product: Object.entries(product._doc),
            deliveryAddress: req.body.order.deliveryAddress
        }
    }
    new Order(payload)
        .save()
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/order/client", async (req, res) => {
    const { accountId, status, deliveryStatus, type } = req.query;

    if (type === "all") return Order.find({})
        .select({ __v: 0, _id: 0 })
        .then(async (value) => res.status(200).json(value))
        .catch(err => res.status(400).json(err));

    if (deliveryStatus !== undefined) return Order.find({ "header.clientId": accountId, "order.deliveryStatus": deliveryStatus })
        .select({ __v: 0, _id: 0 })
        .then(async (value) => {
            const results = [];
            for (let index = 0; index < value.length; index++) {
                const driver = await Profile.findOne({ accountId: value[index].header.driverId });
                let staff;
                if (value[index].header.staffId !== undefined) {
                    staff = await Profile.findOne({ accountId: value[index].header.staffId });
                }
                results.push({
                    driver,
                    staff,
                    ...value[index]._doc
                })
            }
            return res.status(200).json(results);
        })
        .catch(err => res.status(400).json(err));

    Order.find({ "header.clientId": accountId, "order.status": status })
        .select({ __v: 0, _id: 0 })
        .then(async (value) => {
            const results = [];

            for (let index = 0; index < value.length; index++) {
                if (value[index].order.deliveryStatus === undefined) {
                    const driver = await Profile.findOne({ accountId: value[index].header.driverId });
                    let staff;
                    if (value[index].header.staffId !== undefined) {
                        staff = await Profile.findOne({ accountId: value[index].header.staffId });
                    }
                    results.push({
                        driver,
                        staff,
                        ...value[index]._doc
                    })
                }

            }
            return res.status(200).json(results);
        })
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
    const { status, deliveryStatus, type } = req.query;

    if (type === "all") return Order.find({ "order.deliveryStatus": "delivered" })
        .select({ __v: 0, _id: 0 })
        .then(async (value) => {
            const results = [];
            for (let index = 0; index < value.length; index++) {
                const client = await Profile.findOne({ accountId: value[index].header.clientId });
                results.push({
                    client,
                    ...value[index]._doc
                })
            }
            return res.status(200).json(results);
        })
        .catch(err => res.status(400).json(err));

    if (status !== undefined)
        return Order.find({ "order.status": status })
            .select({ __v: 0, _id: 0 })
            .then(async (value) => {
                const results = [];
                for (let index = 0; index < value.length; index++) {
                    const client = await Profile.findOne({ accountId: value[index].header.clientId });
                    let staff;
                    if (value[index].header.staffId !== undefined) {
                        staff = await Profile.findOne({ accountId: value[index].header.staffId });
                    }
                    results.push({
                        client,
                        staff,
                        ...value[index]._doc
                    })
                }
                return res.status(200).json(results);
            })
            .catch(err => res.status(400).json(err));

    if (deliveryStatus !== undefined)
        return Order.find({ "order.deliveryStatus": deliveryStatus, "order.status": "available" })
            .select({ __v: 0, _id: 0 })
            .then(async (value) => {
                const results = [];
                for (let index = 0; index < value.length; index++) {
                    const client = await Profile.findOne({ accountId: value[index].header.clientId });
                    results.push({
                        client,
                        ...value[index]._doc
                    })
                }
                return res.status(200).json(results);
            })
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
            $set: {
                "header.driverId": accountId,
                "order.deliveryStatus": deliveryStatus,
                "order.status": deliveryStatus === "delivered" ? "unavailable" : "available"
            }
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