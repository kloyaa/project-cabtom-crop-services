require("dotenv").config();
const express = require("express");
const router = express.Router();
const Product = require("../models/product")

const productId = process.env.DEFAULT_ID;

router.post("/product", async (req, res) => {

    const product = await Product.find({});
    if (product.length >= 1) return res
        .status(400)
        .json({ message: "Maximum of product is 1, Please edit the existing one." });

    new Product(req.body)
        .save()
        .then(value => res.status(200).json(value))
        .catch(err => res.status(400).json(err));
});

router.get("/product", (req, res) => {

    Product.findOne({ productId })
        .select({ __v: 0, _id: 0 })
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Product not found" })
            return res.status(200).json(value);
        })
        .catch(err => res.status(400).json(err));

});

router.put("/product", (req, res) => {

    const update = {
        $set: {
            ...req.body,
            "date": { "updatedAt": Date.now() },
        }
    }
    Product.findOneAndUpdate({ productId }, update, { new: true })
        .then(value => {
            if (!value) return res
                .status(400)
                .json({ message: "Product not found" })
            return res.status(200).json(value);
        })
        .catch(err => res.status(400).json(err));

});

module.exports = router;