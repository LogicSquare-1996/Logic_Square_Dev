const mongoose = require("mongoose");

const MarksheetSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },

  rollNumber: {
    type: String,
    required: true
  },

  className: {
    type: String, // e.g., "10th", "9th"
    required: true
  },

  marks: {
    math: {
      type: Number
    },
    science: {
      type: Number
    },
    english: {
      type: Number
    },
    history: {
      type: Number
    },
    geography: {
      type: Number
    }
    // Add more subjects if needed
  }
});

module.exports = mongoose.model("Marksheet", MarksheetSchema);