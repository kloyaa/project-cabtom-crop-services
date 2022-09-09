const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const options = { autoCreate: false };
const BillingSchema = new Schema({
    reference: {
        type: String,
        default: uuidv4()
    },
    orderId: {
        type: String,
        required: [true, "orderId is required"],
    },
    header: {
        clientId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, "clientId is required"],
        },
        // Update once accepted
        staffId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, "staffId is required"],
        },
        driverId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, "driverId is required"],
        }
    },
    payment: {
        amount: {
            type: Number,
            required: [true, "amount is required"],
        },
        date: {
            type: Date,
            required: [true, "date is required"],
        }
    }
}, options);




module.exports = Billing = mongoose.model("trucks", BillingSchema);
