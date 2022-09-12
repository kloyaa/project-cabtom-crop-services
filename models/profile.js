const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = { autoCreate: false };
const ProfileSchema = new Schema({
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        unique: true,
        required: [true, "accountId is required"]
    },
    role: {
        type: String,
        enum: ["owner", "client", "driver", "staff"]
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    name: {
        first: {
            type: String,
            required: [true, "firstName is required"]
        },
        last: {
            type: String,
            required: [true, "lastName is required"]
        },
        maiden: {
            type: String,
            required: [true, "maiden is required"]
        }
    },
    contactNumber: {
        type: String,
        required: [true, "contactNumber is required"]
    },
    address: {
        type: String,
        required: [true, "address is required"]
    },
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    // Optional Fields
    companyName: { type: String },
    position: { type: String },
    vehicle: { type: {} },

}, options);

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
