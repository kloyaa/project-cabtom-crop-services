const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = { autoCreate: false };
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "email is required"],
    },
    hashValue: {
        type: String,
        required: [true, "hashValue is required"],
    },
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: { type: Date }
    },
}, options);

module.exports = User = mongoose.model("users", UserSchema);
