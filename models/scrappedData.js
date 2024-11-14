const mongoose = require("mongoose");

const ScrappingSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    platform: {
      type: String,
    },
    country: {
      type: String,
    },
    category: {
      type: String,
    },
    dateOfData: {
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
    categories: [
      {
          categoryText: String,
          categoryLink: String
      }
  ],
  networks: [
      {
          networkText: String,
          networkLink: String
      }
  ],
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScrappingData", ScrappingSchema);
