const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    header: {
        name: {
            first: {
                type: String,
                required: [true, "first is required"],
            },
            last: {
                type: String,
                required: [true, "last is required"],
            },
        },
        email: {
            type: String,
            required: [true, "email is required"],
        },
    },
    message: {
        type: String,
        required: [true, "message is required"],
    },
    opened: {
        type: Boolean,
        default: false
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
});

module.exports = Message = mongoose.model("messages", MessageSchema);
