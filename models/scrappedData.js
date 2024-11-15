const mongoose = require("mongoose");

const ChartsSchema = new mongoose.Schema({
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
    scarappingDate: {
      type: String,
    },
    rank: {
      type: String,
    },
    prevDayRank: {
      type: String,
    },
    imageLink: {
      type: String,
    },
    title: {
      type: String,
    },
    titleLink: {
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
  }
);


ChartsSchema.pre('save', async function (next) {
    const scrapping = this;
  
    if (!scrapping.scrappingDate || !scrapping.titleLink) {
      return next(); // Skip if no scrappingDate or titleLink
    }
  
    try {
      // Calculate the previous day's date
      const currentDate = new Date(scrapping.scrappingDate);
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      const previousDateString = previousDate.toISOString().split('T')[0];
  
      // Find the record for the previous day using titleLink as a unique identifier
      const previousDayRecord = await mongoose
        .model('ChartsData')
        .findOne({ scrappingDate: previousDateString, titleLink: scrapping.titleLink });
  
      // Update prevDayRank if a previous day record is found
      scrapping.prevDayRank = previousDayRecord ? previousDayRecord.rank : "0";
  
      next();
    } catch (err) {
      next(err); // Pass error to next middleware
    }
  });
  


  ChartsSchema.set("timestamps", true)
  ChartsSchema.set("toJSON", { virtuals: true })
  ChartsSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("ChartsData", ChartsSchema);
