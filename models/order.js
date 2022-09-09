const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const options = { autoCreate: false };

const OrderSchema = new Schema({
    orderId: {
        type: String,
        default: uuidv4()
    },
    header: {
        clientId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, "clientId is required"],
        },
        // Update once accepted
        staffId: { type: mongoose.SchemaTypes.ObjectId },
        driverId: { type: mongoose.SchemaTypes.ObjectId }
    },
    order: {
        product: {
            type: Map,
            required: [true, "product is required"],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        },
        deliveryAddress: {
            type: String,
            required: [true, "deliveryAddress is required"],
        },
        deliveryStatus: { type: String }
    },
}, options);

module.exports = Order = mongoose.model("orders", OrderSchema);
