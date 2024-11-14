const mongoose = require("mongoose");

const ScrappingSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
    },
    country: {
      type: String,
    },
    category: {
      type: String,
    },
    url: {
      type: String,
    },
    dateOfScrap: {
      type: String,
    },
    rank: {
      type: String,
    },
    imageLink: {
      type: String,
    },
    title: {
      type: String,
    },
    link: {
      type: String,
    },
    description: {
      type: String,
    },
    categoryLinks: [
      {
        type: String,
      },
    ],
    networkText: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScrappingData", ScrappingSchema);
