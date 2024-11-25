const mongoose = require("mongoose");

const FollwerSchema = new mongoose.Schema({
    followers: [String],
    // hrefs: [String],
    followings: [String]
})
FollwerSchema.set("timestamps", true)
FollwerSchema.set("toJSON", { virtuals: true })
FollwerSchema.set("toObject", { virtuals: true })
module.exports = mongoose.model("Follower", FollwerSchema);