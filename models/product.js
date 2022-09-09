require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = { autoCreate: false };
const ProductSchema = new Schema({
    productId: {
        type: String,
        default: process.env.DEFAULT_ID
    },
    price: {
        type: Number,
        required: [true, "price is required"],
    },
    quantity: {
        type: Number,
        required: [true, "quantity is required"],
    },
    unit: {
        type: Number,
        required: [true, "unit is required"],
    },
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: { type: Date }
    },
}, options);

module.exports = Product = mongoose.model("products", ProductSchema);
