const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionsSchema = new Schema({
    email: {
        type: String,
        required: [true, "email is required"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
module.exports = Subscription = mongoose.model("subscriptions", SubscriptionsSchema);

