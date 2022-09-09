const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = { autoCreate: false };

const DriverSchema = new Schema({
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "accountId is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    model: {
        type: String,
        required: [true, "model is required"],
    },
    plateNumber: {
        type: String,
        unique: true,
        required: [true, "plateNumber is required"],
    },
}, options);




module.exports = Driver = mongoose.model("trucks", DriverSchema);
